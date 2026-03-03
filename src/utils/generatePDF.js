import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

/**
 * دالة لتوليد بيانات الـ QR Code
 */
const buildQRData = (client) =>
  [
    `اسم المنشأة: ${client.name}`,
    `الرقم الموحد: ${client.unifiedNumber || "7013113043"}`,
    `السجل التجاري: ${client.crNumber || "2511003152"}`,
    `رقم الطلب: ${client.requestNumber || "11169918"}`,
    `تاريخ الطلب: ${client.date}`,
    `https://es.hafrchamber.org.sa/#/DocumentVerify`,
  ].join("\n");

const fmtHijriDate = (d) => {
  try {
    return new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(new Date(d));
  } catch {
    return d;
  }
};

const fmtGregorianDate = (d) => {
  const dt = new Date(d);
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yyyy = dt.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const fmtValidDate = (d) => {
  const dt = new Date(d);
  dt.setMonth(dt.getMonth() + 3);
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yyyy = dt.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export const generateClientPDF = async (client) => {
  // 1. توليد الباركود
  const qrDataURL = await QRCode.toDataURL(buildQRData(client), {
    width: 120,
    margin: 1,
  });

  const greDate = fmtGregorianDate(client.date);
  const hijDate = fmtHijriDate(client.date);
  const validTil = fmtValidDate(client.date);

  // 2. بناء القالب (Template)
  const html = `
<div id="pdf-root" style="width: 794px; height: 1123px; background: #fff; font-family: 'Arial', sans-serif; position: relative; color: #333; box-sizing: border-box; overflow: hidden;">
  

  <div style="display: flex; justify-content: flex-end; margin-top: -30px; position: relative; z-index: 2;">
    <img src="/src/imgs/Header.jpg" width="794" />
  </div>

<div style="
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px 20px;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  font-size: 11px;
  line-height: 1.7;
  position: relative;
">

  <!-- Arabic Section -->
  <div dir="rtl" style="
    text-align: right;
    word-break: break-word;
  ">
    <div style="font-weight: 700; font-size: 15px; margin-bottom: 6px;">
      مؤسسة ${client.name}
    </div>

    <div>الرقم الموحد (700) : ${client.unifiedNumber || "7013113043"}</div>
    <div>السجل التجاري : ${client.crNumber || "2511003152"}</div>
    <div>حفر الباطن - هاتف: 0137221363 فاكس: 0137221363</div>

    <div style="margin-top: 10px;">
      تاريخ الطلب : ${hijDate} هـ
    </div>

    <div>الرقم المرجعي : ${client.refNumber || "11169918"}</div>
  </div>


  <!-- QR + Disclaimer -->
  <div style="
    width: 70%;
    text-align: center;
    padding: 0 10px;
    box-sizing: border-box;
  ">

    <img src="${qrDataURL}" width="95" height="95" style="display:block;margin:0 auto;" />

    <div style="font-size: 12px; margin-top: 6px;">
      https://es.hafrchamber.org.sa/#/DocumentVerify
    </div>

    <div dir="rtl" style="
      font-size: 9px;
      margin-top: 8px;
      text-align: justify;
    ">
      تم إصدار التصديق بناءً على طلب المشترك، دون أدنى مسؤولية على غرفة حفر الباطن
      عن محتوى الوثيقة، علماً أنه لا يعتد بالتصديق إلا بعد التحقق منه من خلال قراءة QR Code.
    </div>

    <div dir="ltr" style="
      font-size: 9px;
      margin-top: 6px;
      text-align: justify;
    ">This Certification was issued at the request of the subscriber, and the HAFR ELBATEN Chamber name disclaims responsibility for its content. and this certification is only reliable after it has been verified by scanning the request’s QR Code and reviewing the request’s data details.
    </div>

  </div>


  <!-- English Section -->
  <div dir="ltr" style="
    text-align: left;
    word-break: break-word;
  ">
    <div style="font-weight: 700; font-size: 14px; margin-bottom: 6px;">
      Establishment ${client.name}
    </div>

    <div>Unified Number : ${client.unifiedNumber || "7013113043"}</div>
    <div>CR Number : ${client.crNumber || "2511003152"}</div>
    <div>Tel : 0137221363 | Fax : 0137221363</div>

    <div style="margin-top: 10px;">
      Date : ${greDate}
    </div>

    <div>Ref Number : ${client.refNumber || "11169918"}</div>
  </div>

</div>
<div style="
  height: 1px;
  background-color: #000;
  margin: 0 20px;
  width: calc(100% - 40px);
"></div>
  <div style="padding: 40px 60px; min-height: 400px; direction: rtl; text-align: right; position: relative; z-index: 1;">
      <div style="font-weight: bold; font-size: 16px; margin-bottom: 20px;">
        نفيدكم نحن مؤسسة / علي حسين سالم فتوح للنقليات سجل رقم / 7013113043
      </div>
      <div style="font-size: 14.5px; line-height: 2;">
      ${client.bodyText || "11169918"}
        <div style=" font-weight: bold;">ولكم جزيل الشكر،</div>
      </div>
  </div>

  <div style=" display: flex; align-items: stretch; background: #fff; padding: 0 20px; margin-top: 300px; direction: rtl;">
  
  <!-- الشعار أقصى اليمين -->
  <div style="flex: 0 0 110px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-left: 1px solid #eee; padding-left: 10px;">
     <img src="/src/imgs/Footer logo.jpeg" width="80" />
  </div>

  <!-- النص العربي -->
  <div style="flex: 1; padding: 10px; font-size: 9px; line-height: 1.6; text-align: right; direction: rtl;">
    <div>تم بواسطة علي حسين سالم الفتوح</div>
    <div>أي إضافة أو كشط على هذه الوثيقة تعتبر لاغية</div>
    <div>تعتبر هذه الوثيقة الإلكترونية مستوفية للإجراءات النظامية المتبعة بالغرفة</div>
    <div style=" font-weight: bold; margin-top: 3px;">
       <span style="color: #c0392b;">تنويه</span> : النموذج صالح حتي ${validTil}
    </div>
  </div>

  <!-- النص الإنجليزي -->
  <div style="flex: 1; padding: 10px; font-size: 9px; line-height: 1.6; text-align: left; direction: ltr;">
    <div>Created by Ali Husain alfattouh</div>
    <div>Any addition or scraping on this document is considered void</div>
    <div>This electronic document fulfills the regular procedures followed by the Chamber</div>
    <div style=" font-weight: bold; margin-top: 3px;">
     <span style="color: #c0392b;">Note</span>  : Document Valid till ${validTil}
    </div>
  </div>
  </div>
  
  
  <div style="background-color: #8395A7;   border-radius: 2px; color: #fff; font-size: 12px; padding: 4px 8px; text-align: right;">1/1</div>
</div>

`;


  // 3. التحويل إلى PDF
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "position:fixed;left:-9999px;top:0;z-index:-1;";
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  await new Promise((r) => setTimeout(r, 600));

  const canvas = await html2canvas(wrapper.querySelector("#pdf-root"), {
    scale: 3,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`وثيقة-${client.refNumber || "11169918"}.pdf`);
  document.body.removeChild(wrapper);
};
