import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Text, Transformer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";

/* /* محرر Konva بسيط مع عنصر نص قابل للسحب/التدوير/التحجيم */ */

type TText = {
  x: number;
  y: number;
  text: string;
  fontSize: number;
  rotation: number;
  width?: number;
  id: string;
  fill?: string | CanvasPattern | any;
  fillType?: "solid" | "gradient" | "pattern";
};

const InitialText: TText = {
  x: 150,
  y: 120,
  text: "نصّ قابل للتعديل",
  fontSize: 36,
  rotation: 0,
  id: "text-1",
  fillType: "solid",
  fill: "#111"
};

function KonvaPatternImage({ src, onLoad }: { src: string; onLoad?: (img: HTMLImageElement) => void }) {
  const [image] = useImage(src);
  useEffect(() => {
    if (image && onLoad) onLoad(image as any);
  }, [image, onLoad]);
  // /* هذا مكوّن للمساعدة فقط، في حال رغبنا بنقش صورة كنمط */
  return image ? <KonvaImage image={image as any} visible={false} /> : null;
}

export default function CanvasEditor() {
  const [texts, setTexts] = useState<TText[]>([InitialText]);
  const [selectedId, setSelectedId] = useState<string | null>(InitialText.id);
  const trRef = useRef<any>(null);
  const stageRef = useRef<any>(null);
  const [patternImgSrc, setPatternImgSrc] = useState<string | null>(null);
  const patternRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (trRef.current && selectedId) {
      const stage = trRef.current.getStage ? trRef.current.getStage() : null;
      trRef.current.nodes([stage.findOne(`#${selectedId}`)]);
      trRef.current.getLayer()?.batchDraw?.();
    }
  }, [selectedId]);

  const handleDragEnd = (id: string, e: any) => {
    setTexts((prev) => prev.map(t => t.id === id ? {...t, x: e.target.x(), y: e.target.y()} : t));
  };

  const handleTransformEnd = (id: string, e: any) => {
    const node = e.target;
    const scaleX = node.scaleX() || 1;
    const scaleY = node.scaleY() || 1;
    node.scaleX(1);
    node.scaleY(1);
    setTexts((prev) =>
      prev.map(t =>
        t.id === id ? {...t, x: node.x(), y: node.y(), rotation: node.rotation(), fontSize: Math.max(8, t.fontSize * scaleY)} : t
      )
    );
  };

  // تغيير نوع التعبئة: solid | gradient | pattern
  const changeFillType = (type: TText["fillType"]) => {
    setTexts(prev => prev.map(t => t.id === selectedId ? {...t, fillType: type} : t));
  };

  // تحميل صورة نقش امثلة
  const onPatternLoad = (img: HTMLImageElement | undefined) => {
    if (img) patternRef.current = img;
  };

  const selectedText = texts.find(t => t.id === selectedId);

  return (
    <div style={{width: "100%", height: "100%"}}>
      {/* عنصر Pattern Image مخفي (مفيد لتهيئة النمط) */}
      {patternImgSrc && <KonvaPatternImage src={patternImgSrc} onLoad={onPatternLoad} />}
      <Stage width={800} height={600} ref={stageRef}>
        <Layer>
          {texts.map(t => (
            <Text
              key={t.id}
              id={t.id}
              x={t.x}
              y={t.y}
              text={t.text}
              fontSize={t.fontSize}
              rotation={t.rotation}
              draggable
              onDragEnd={(e) => handleDragEnd(t.id, e)}
              onTransformEnd={(e) => handleTransformEnd(t.id, e)}
              onClick={() => setSelectedId(t.id)}
              // تعبئة تعتمد على نوع fillType
              fill={(() => {
                if (t.fillType === "solid") return t.fill;
                if (t.fillType === "gradient") {
                  // Konva يدعم fillLinearGradientStartPoint و related props
                  // هنا نضع لون افتراضي — سيتم وضعها عبر props إذا أردت
                  return undefined;
                }
                if (t.fillType === "pattern" && patternRef.current) {
                  // /* Konva Text لا يدعم patternImage مباشرة في كل الإصدارات؛ هذا مثال توضيحي */ 
                  return undefined;
                }
                return t.fill;
              })()}
              // أمثلة لخصائص التدرّج لو أردت
              fillLinearGradientStartPoint={{x:0,y:0}}
              fillLinearGradientEndPoint={{x:200,y:0}}
              fillLinearGradientColorStops={[0, '#ff6b6b', 1, '#1e90ff']}
            />
          ))}
          <Transformer ref={trRef} rotateEnabled enabledAnchors={['top-left','top-right','bottom-left','bottom-right','middle-left','middle-right']} />
        </Layer>
      </Stage>

      {/* واجهة تحكم تجريبية مختصرة */}
      <div style={{position:"absolute", right: 20, top: 20, background:"#fff", padding:8, borderRadius:4, boxShadow:"0 2px 6px rgba(0,0,0,0.15)"}}>
        <div style={{marginBottom:6}}>
          <button onClick={() => changeFillType("solid")}>Solid Fill</button>
          <button onClick={() => changeFillType("gradient")}>Gradient Fill</button>
          <button onClick={() => changeFillType("pattern")}>Image Pattern</button>
        </div>
        <div>
          <input type="file" accept="image/*" onChange={(e)=> {
            const f = e.target.files?.[0];
            if (f && f.size < 5 * 1024 * 1024) {
              const url = URL.createObjectURL(f);
              setPatternImgSrc(url);
            } else {
              alert("الملف كبير جداً (الحد: 5MB)"); // /* رسالة للمستخدم */ 
            }
          }} />
        </div>
      </div>
    </div>
  );
}
