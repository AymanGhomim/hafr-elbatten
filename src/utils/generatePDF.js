import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

const buildQRData = (client) => {
  const baseUrl =
    import.meta.env.VITE_BASE_URL || "https://es.hafrchamber.org.sa";
  const verifyUrl = `${baseUrl}/api/user/verify/${client?.refNumber}`;
  return [
    `اسم المنشأة: ${client.name}`,
    `الرقم الموحد: ${client.unifiedNumber || ""}`,
    `السجل التجاري: ${client.crNumber || ""}`,
    `رقم الطلب: ${client.requestNumber || ""}`,
    `تاريخ الطلب: ${client.date}`,
    verifyUrl,
  ].join("\n");
};

const getVerifyUrl = (client) => {
  const baseUrl =
    import.meta.env.VITE_BASE_URL || "https://es.hafrchamber.org.sa";
  return `${baseUrl}/api/user/verify/${client?.refNumber}`;
};

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
  const verifyUrl = getVerifyUrl(client);

  const qrDataURL = await QRCode.toDataURL(buildQRData(client), {
    width: 120,
    margin: 1,
  });

  const greDate = fmtGregorianDate(client.date);
  const hijDate = fmtHijriDate(client.date);
  const validTil = fmtValidDate(client.date);

  const html = `
<div id="pdf-root" style="
  width: 794px;
  height: 1123px;
  background: #fff;
  font-family: Arial, sans-serif;
  color: #333;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
">

  <!-- Header Image -->
  <div style="flex-shrink: 0; margin-bottom: 20px; z-index: 4;">
    <img src="/src/imgs/Header.jpg" width="794" style="display:block;" />
  </div>

  <!-- Info Row -->
  <div style="
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 12px 20px;
    font-size: 11px;
    line-height: 1.7;
    box-sizing: border-box;
  ">
    <!-- Arabic -->
    <div dir="rtl" style="text-align: right; word-break: break-word; flex: 1;">
      <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">مؤسسة ${client.name || "—"}</div>
      <div>الرقم الموحد (700) : ${client.unifiedNumber || "—"}</div>
      <div>السجل التجاري : ${client.crNumber || "—"}</div>
      <div>حفر الباطن - هاتف: 0137221363 فاكس: 0137221363</div>
      <div style="margin-top: 8px;">تاريخ الطلب : ${hijDate} هـ</div>
      <div>الرقم المرجعي : ${client.refNumber || client.requestNumber || "—"}</div>
    </div>

    <!-- QR -->
    <div style="flex: 1.2; text-align: center; padding: 0 8px; box-sizing: border-box;">
      <img src="${qrDataURL}" width="95" height="95" style="display:block;margin:0 auto;" />
      <div style="font-size: 10px; margin-top: 4px;">${verifyUrl}</div>
      <div dir="rtl" style="font-size: 8.5px; margin-top: 6px; text-align: justify;">
        تم إصدار التصديق بناءً على طلب المشترك، دون أدنى مسؤولية على غرفة حفر الباطن عن محتوى الوثيقة، علماً أنه لا يعتد بالتصديق إلا بعد التحقق منه من خلال قراءة QR Code.
      </div>
      <div dir="ltr" style="font-size: 8.5px; margin-top: 4px; text-align: justify;">
        This Certification was issued at the request of the subscriber, and the HAFR ELBATEN Chamber name disclaims responsibility for its content. This certification is only reliable after it has been verified by scanning the request's QR Code and reviewing the request's data details.
      </div>
    </div>

    <!-- English -->
    <div dir="ltr" style="text-align: left; word-break: break-word; flex: 1;">
      <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">Establishment ${client.name || "—"}</div>
      <div>Unified Number : ${client.unifiedNumber || "—"}</div>
      <div>CR Number : ${client.crNumber || "—"}</div>
      <div>Tel : 0137221363 | Fax : 0137221363</div>
      <div style="margin-top: 8px;">Date : ${greDate}</div>
      <div>Ref Number : ${client.refNumber || client.requestNumber || "—"}</div>
    </div>
  </div>

  <!-- Divider -->
  <div style="flex-shrink: 0; height: 1px; background: #000; margin: 0 20px;"></div>

  <!-- Body -->
  <div style="
    flex: 1;
    padding: 30px 60px 16px 60px;
    direction: rtl;
    text-align: right;
    overflow: hidden;
    box-sizing: border-box;
  ">
    <div style="
      font-size: 14.5px;
      line-height: 2;
      white-space: pre-line;
      font-family: Arial, sans-serif;
    ">${client.bodyText || ""}</div>
    <div style="font-weight: bold; margin-top: 16px; font-size: 14px;">ولكم جزيل الشكر،</div>
  </div>

  <!-- Footer -->
  <div style="
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 8px 20px;
    direction: rtl;
    border-top: 1px solid #eee;
    box-sizing: border-box;
  ">
    <div style="flex: 0 0 100px; display:flex; align-items:center; justify-content:center; border-left: 1px solid #eee; padding-left: 10px;">
      <img src="/src/imgs/Footer logo.jpeg" width="75" />
    </div>

    <div style="flex: 1; padding: 6px 10px; font-size: 8.5px; line-height: 1.6; text-align: right; direction: rtl;">
      <div>تم بواسطة ${client.name || "—"}</div>
      <div>أي إضافة أو كشط على هذه الوثيقة تعتبر لاغية</div>
      <div>تعتبر هذه الوثيقة الإلكترونية مستوفية للإجراءات النظامية المتبعة بالغرفة</div>
      <div style="font-weight: bold; margin-top: 2px;">
        <span style="color: #c0392b;">تنويه</span> : النموذج صالح حتي ${validTil}
      </div>
    </div>

    <div style="flex: 1; padding: 6px 10px; font-size: 8.5px; line-height: 1.6; text-align: left; direction: ltr;">
      <div>Created by ${client.name || "—"}</div>
      <div>Any addition or scraping on this document is considered void</div>
      <div>This electronic document fulfills the regular procedures followed by the Chamber</div>
      <div style="font-weight: bold; margin-top: 2px;">
        <span style="color: #c0392b;">Note</span> : Document Valid till ${validTil}
      </div>
    </div>
  </div>

  <!-- Page Number -->
  <div style="flex-shrink: 0; background: #8395A7; color: #fff; font-size: 11px; padding: 3px 10px; text-align: right;">1/1</div>

</div>
`;

  const wrapper = document.createElement("div");
  wrapper.style.cssText = "position:fixed;left:-9999px;top:0;z-index:-1;";
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  await new Promise((r) => setTimeout(r, 800));

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
  pdf.save(
    `وثيقة-${client.refNumber || client.requestNumber || "document"}.pdf`,
  );
  document.body.removeChild(wrapper);
};
