// netlify/functions/upload.js
// /* Netlify Function بسيط لاستقبال ملف كـ base64 وإرجاع نتيجة */ 

exports.handler = async function(event, context) {
  try {
    const body = JSON.parse(event.body || "{}");
    const { filename, data } = body;
    if (!filename || !data) {
      return {
        statusCode: 400,
        body: JSON.stringify({ status: "error", message: "missing filename or data" })
      };
    }

    // /* MVP: هنا فقط نتأكد من استقبال البيانات ثم نعيد استجابة.
       في المرحلة التالية يمكن رفعها إلى Cloudflare R2 أو Google Drive. */ 
    console.log("Received upload:", filename, "size(base64)=", data.length);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "ok", message: "received", filename })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: "internal" })
    };
  }
};
