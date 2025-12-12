import React, { useState } from "react";
import axios from "axios";
import { convertToOutline } from "../utils/fontOutline";

/* /* شريط جانبي مبسّط: رفع، Google Picker (stub)، تحويل إلى مسارات */ */

export default function Toolbar() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f && f.size > 5 * 1024 * 1024) {
      alert("الملف أكبر من الحد المسموح (5MB).");
      return;
    }
    setFile(f);
  };

  const upload = async () => {
    if (!file) return alert("اختر ملفاً أولاً");
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async function() {
        const base64 = (reader.result as string).split(",")[1];
        const res = await axios.post("/.netlify/functions/upload", { filename: file.name, data: base64 });
        alert("Upload response: " + JSON.stringify(res.data));
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const pickFromDrive = () => {
    alert("Google Picker stub — في المرحلة التالية سنربط OAuth و Google Picker");
  };

  const handleConvert = async () => {
    try {
      await convertToOutline("Sample text", "Arial", 72);
      alert("convertToOutline executed — تحقق من Console");
    } catch (e) {
      console.error(e);
      alert("خطأ في تحويل المسار (راجع Console)");
    }
  };

  return (
    <div>
      <div style={{marginBottom:12}}>
        <input type="file" onChange={onFileChange} />
        <button onClick={upload} disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
      </div>
      <div style={{marginBottom:12}}>
        <button onClick={pickFromDrive}>Pick from Google Drive</button>
      </div>
      <div>
        <button onClick={handleConvert}>Convert to outlines (stub)</button>
      </div>
    </div>
  );
}
