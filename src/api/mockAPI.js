// ─── Mock Data ────────────────────────────────────────────────────────────────
export const mockClients = [
  {
    id: 1,
    name: 'مؤسسة علي حسين البلوي',
    requestNumber: 'REQ-2024-001',
    date: '2024-03-15',
    amount: 1250.00,
    unifiedNumber: '7013113043',
    crNumber: '2511003152',
    refNumber: '11169918',
    bodyText: `نفيدكم نحن مؤسسة / علي حسين سالم فتوح للنقليات سجل رقم / 7013113043
بأننا نتنازل عن السيارة الموضح بياناتها أدناه:
النوع / مرسيدس الموديل / 2015
رقم اللوحة / 3328  3 أ ص     الرقم التسلسلي / 864257710
لمعرض الصليبيخ للشاحنات كما نفوضه بنقل ملكية السيارة والتوقيع نيابة عنا وإنهاء الإجراءات المتعلقة بذلك.
ويتم تسليم القيمة (120000) فقط ومئة وعشرون الف ريال سعودي لا غير.
إلى السيد/ علي حسين سالم فتوح  رقم الهوية/1020525505.
ولكم جزيل الشكر.`,
  },
  {
    id: 2,
    name: 'شركة فاطمة للتجارة',
    requestNumber: 'REQ-2024-002',
    date: '2024-03-16',
    amount: 3400.50,
    unifiedNumber: '7013224456',
    crNumber: '2511004210',
    refNumber: '11170022',
    bodyText: 'يُفيد هذا المستند بأن الشركة المذكورة أعلاه قد استوفت جميع المتطلبات النظامية المطلوبة وفق الإجراءات المعتمدة لدى الغرفة.',
  },
  {
    id: 3,
    name: 'محمد عبدالله الحربي',
    requestNumber: 'REQ-2024-003',
    date: '2024-03-17',
    amount: 750.00,
    unifiedNumber: '7013331122',
    crNumber: '2511005301',
    refNumber: '11170155',
    bodyText: 'نشهد بأن صاحب الطلب قد قدّم جميع المستندات المطلوبة وتمت الموافقة على طلبه وفق الأنظمة المعمول بها.',
  },
  {
    id: 4,
    name: 'نورة سعد القحطاني',
    requestNumber: 'REQ-2024-004',
    date: '2024-03-18',
    amount: 5200.75,
    unifiedNumber: '7013448899',
    crNumber: '2511006400',
    refNumber: '11170288',
    bodyText: 'تفيد هذه الوثيقة بأن المنشأة المشار إليها أعلاه مسجلة لدى غرفة حفر الباطن وتمارس نشاطها التجاري وفق الأنظمة واللوائح المعتمدة.',
  },
  {
    id: 5,
    name: 'خالد إبراهيم العتيبي',
    requestNumber: 'REQ-2024-005',
    date: '2024-03-19',
    amount: 980.25,
    unifiedNumber: '7013556677',
    crNumber: '2511007500',
    refNumber: '11170399',
    bodyText: 'يُشهد بموجب هذه الوثيقة بأن صاحب الطلب عضو فعّال في غرفة حفر الباطن ويتمتع بكافة الحقوق المقررة للأعضاء.',
  },
  {
    id: 6,
    name: 'منيرة يوسف الشمري',
    requestNumber: 'REQ-2024-006',
    date: '2024-03-20',
    amount: 2150.00,
    unifiedNumber: '7013664433',
    crNumber: '2511008600',
    refNumber: '11170500',
    bodyText: 'نفيد بأن المنشأة المذكورة أعلاه قد سددت جميع الرسوم والاشتراكات المستحقة عليها حتى تاريخه.',
  },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const apiLogin = async (username, password) => {
  await delay(1200);
  if (username && password.length >= 6) {
    return { token: 'mock-jwt-token-' + Date.now() };
  }
  throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
};

export const apiGetClients = async (_token) => {
  await delay(900);
  return [...mockClients];
};

export const apiCreateClient = async (_token, data) => {
  await delay(800);
  const newClient = { id: Date.now(), ...data };
  mockClients.push(newClient);
  return newClient;
};

export const apiUpdateClient = async (_token, id, data) => {
  await delay(800);
  const idx = mockClients.findIndex((c) => c.id === id);
  if (idx !== -1) mockClients[idx] = { ...mockClients[idx], ...data };
  return mockClients[idx];
};
