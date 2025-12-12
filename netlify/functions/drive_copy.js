// netlify/functions/drive_copy.js
// /* Stub: هذه الدالة ستستقبل access_token و file metadata لنسخ ملف إلى Google Drive */ 

exports.handler = async function(event, context) {
  try {
    const body = JSON.parse(event.body || "{}");
    const { access_token, filename, base64 } = body;
    if (!access_token || !filename) {
      return { statusCode: 400, body: JSON.stringify({ status: "error", message: "missing token or filename" }) };
    }

    // /* MVP: لا نقوم بالاتصال الفعلي الآن — نعيد رسالة توضيحية */
    console.log("Drive copy stub:", filename);
    return { statusCode: 200, body: JSON.stringify({ status: "ok", message: "drive_copy stub executed" }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ status: "error", message: "internal" }) };
  }
};
