export const packingNote =
  'It leaves in a garment bag, unscented tissue, and a rigid box. The cloth is never scented.'

export const packingNoteAr =
  'يخرج في كيس للثوب، وورق خالٍ من العطر، وصندوق صلب. القماش لا يُعطَّر.'

export const careLine = 'Cold wash or wet clean. Press from the reverse. Hang.'

export const careLineAr = 'غسيل بارد أو تنظيف رطب. الكي من الوجه الخلفي. يُعلَّق.'

export const packingSteps = [
  {
    number: '01',
    title: 'The bag',
    copy: 'A clear garment bag first. Protection for the column, not a logo on the poly.',
    copyAr: 'كيس شفاف أولاً. حماية للعمود، لا شعار على البلاستيك.',
  },
  {
    number: '02',
    title: 'The wrap',
    copy: 'Unscented, acid-free tissue. No perfume, no sachet. The piece should smell of cotton or wool.',
    copyAr: 'ورق حامضيته منخفضة، بلا عطر. لا عطر ولا كيس عطري. يجب أن يشمّ القطن أو الصوف.',
  },
  {
    number: '03',
    title: 'The box',
    copy: 'A rigid box, sealed once. The address sits on the face. Inside: a house card with the piece name, the size you chose, and a line if you wrote one.',
    copyAr: 'صندوق صلب، يُختَم مرة. العنوان على الوجه. داخله بطاقة الدار: اسم القطعة، المقاس، وسطر إن كتبته.',
  },
] as const

export const sewnLabels = [
  {
    number: '01',
    title: 'Neck',
    copy: 'The woven mark: KIANO, London, Est. MMXXIV. Set at the nape by hand after the last press.',
    copyAr: 'العلامة المنسوجة: كيانو، لندن، تأسست MMXXIV. تُثبَّت في القفا يداً بعد آخر كِيّ.',
  },
  {
    number: '02',
    title: 'Size',
    copy: 'A quiet tab, the number only. Sewn in separately, beside the nape, so a tailor can read it.',
    copyAr: 'علامة هادئة، الرقم فقط. تُخاط وحدها، بجانب القفا، ليقرأها الخياط.',
  },
  {
    number: '03',
    title: 'Care',
    copy: `Fibre and pressing, at the side seam. ${careLine}`,
    copyAr: `الخامة والكي، عند درز الجانب. ${careLineAr}`,
  },
] as const
