// netlify/functions/vectorize.js
// /* Stub: استقبال صورة (base64) وتحويلها إلى SVG باستخدام مكتبة vectorization على الخادم.
   في MVP نعيد رسالة توضيحية. */ 

exports.handler = async function(event, context) {
  try {
    const body = JSON.parse(event.body || "{}");
    const { filename } = body;
    console.log("vectorize stub for:", filename);
    return { statusCode: 200, body: JSON.stringify({ status: "ok", svg: "<svg><!-- stub --></svg>" }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ status: "error", message: "internal" }) };
  }
};
