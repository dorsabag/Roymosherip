export type LegacyItem = {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  orientation?: "portrait" | "landscape" | "square";
};

export type TributeItem =
  | {
      id: string;
      kind: "photo";
      title: string;
      src: string;
      alt: string;
      width?: number;
      height?: number;
    }
  | {
      id: string;
      kind: "video";
      title: string;
      src: string;
      poster?: string;
    }
  | {
      id: string;
      kind: "youtube";
      title: string;
      videoId: string;
    }
  | {
      id: string;
      kind: "carousel";
      title: string;
      photos: [GalleryItem, ...GalleryItem[]];
    }
  | {
      id: string;
      kind: "website";
      title: string;
      url: string;
      embedUrl: string;
    };

export type RoyPlace = {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  image?: string;
  year?: string;
};

export type MappedPlace = RoyPlace & { latitude: number; longitude: number };

export type RoyContent = {
  identity: {
    fullName: string;
    birthDate: string;
    deathDate: string;
    deathDescription: string;
    heroIntro: string;
    heroImage: string | null;
  };
  intro: {
    title: string;
    text: string;
    closingLine: string;
    stats: { label: string; value: string }[];
  };
  timeline: {
    id: string;
    year: string;
    type: "milestone" | "story";
    title: string;
    description?: string;
    sticker?: { src: string; alt: string };
  }[];
  funFacts: { id: string; label: string; value: string }[];
  dictionary: {
    id: string;
    term: string;
    type?: string;
    definition: string;
    story?: string;
  }[];
  gallery: GalleryItem[];
  places: RoyPlace[];
  spotify: {
    playlistUrl: string | null;
    playlistUri: string | null;
    intro: string;
    musicStory?: string;
  };
  october7: {
    text: string;
  };
  tributes: TributeItem[];
  legacy: LegacyItem[];
  footer: {
    closingSentence: string;
    madeWithLove: string;
    social: { icon: string; url: string }[];
  };
};

export const royContent: RoyContent = {
  identity: {
    fullName: "רועי משה",
    birthDate: "08.04.1987",
    deathDate: "07.10.2023",
    deathDescription: "נרצח ב־7 באוקטובר 2023",
    heroIntro: "אגדה היה בחייו ואגדה נשאר במותו",
    heroImage: `${import.meta.env.BASE_URL}images/roy/portrait.webp`,
  },

  intro: {
    title: "מי היה רועי?",
    text: `רועי היה איש של משפחה. של בית ושפע. של שמחה. של מסירות הלב והנפש. של חברים, חוויות, צחוקים וגם השתטויות כשצריך. של סקרנות ורצון תמידי להשתפר. של עזרה לכל מי שצריך גם אם מעולם לא ביקש. האיש הראשון להתייצב בחזית, לסייע ולגונן על שבטו, אך מנגד לעשות כל שביכולתו בכדי להימנע מלהטריד אחרים ולבקש עזרה לעצמו.

אין מקום אליו הגיע ולא הפך מיד לאיש הכי אהוב בחדר.
אין אדם שהכיר אותו, ואילו לשניה בלבד, שלא היה מעיד בהחלטיות כי מדובר באדם חכם באופן יוצא דופן.
אין בעיה אותה לא יכל לפתור, ועם המון סטייל, מקוריות וחשיבה מחוץ לקופסה.

ובאירוניה מוחלטת לכל זה, רועי היה בעיקר איש של צניעות וענווה. של הסתפקות במועט. של אף פעם לא לקנות או לעשות לעצמך אלא רק לאחרים.

כל המידות הטובות בבן אדם אחד שהיה ואיננו.`,
    closingLine: "אדם שהותיר פה מאות לבבות שבורים ותהום שלא ניתן למלא.",
    stats: []
  },

  timeline: [
    {
      id: "1987",
      year: "1987",
      type: "milestone",
      title: "תינוק נולד בבית החולים ברזילי באשקלון. ויקרא שמו בישראל - רועי",
      sticker: {
        src: `${import.meta.env.BASE_URL}images/roy/timeline-birth-sticker.webp`,
        alt: "מדבקה של רועי בבגדי תינוק עם בקבוק"
      }
    },
    {
      id: "2000",
      year: "2000",
      type: "milestone",
      title: "רועי חוגג בר מצווה ומתחיל ללמוד בתיכון אורט אפרידר באשקלון",
      description: "יודעי דבר יעידו כי רועי היה תלמיד מצטיין עם ממוצע בגרויות של לא פחות מ-98!",
      sticker: {
        src: `${import.meta.env.BASE_URL}images/roy/timeline-bar-mitzvah-sticker.webp`,
        alt: "מדבקה של רועי בבר מצווה עם ספר תורה וגביע"
      }
    },
    {
      id: "2005",
      year: "2005",
      type: "milestone",
      title: "רועי מתגייס לצה״ל ומשרת כלוחם בחטיבת החי״ר גבעתי",
      sticker: {
        src: `${import.meta.env.BASE_URL}images/roy/timeline-enlistment-sticker.webp`,
        alt: "מדבקה של רועי במדי צה״ל מצדיע"
      }
    },
    {
      id: "2007",
      year: "2007",
      type: "milestone",
      title: "רועי מתחיל קורס קצינים וגם אותו כמובן, מסיים בהצטיינות",
      sticker: {
        src: `${import.meta.env.BASE_URL}images/roy/timeline-officer-course-sticker.webp`,
        alt: "מדבקה של רועי במדים מטפס על חבל"
      }
    },
    {
      id: "2010",
      year: "2010",
      type: "milestone",
      title: "רועי משתחרר מצה״ל ומתחיל ללמוד בישיבה בקרית מלאכי",
      description: "גם שם כמובן, ה״ילד״ נחשב לעילוי",
      sticker: {
        src: `${import.meta.env.BASE_URL}images/roy/timeline-yeshiva-sticker.webp`,
        alt: "מדבקה של רועי עם טלית ותפילין לומד מספר תורה"
      }
    },
    {
      id: "2011",
      year: "2011",
      type: "milestone",
      title: "כשרועי פגש את לינור לראשונה",
      description: "רועי זומן לתעסוקה מבצעית כחלק משירות המילואים שלו וקצינת הקישור שלו הייתה לא אחרת מאשר לינור. והשאר? היסטוריה",
      sticker: {
        src: `${import.meta.env.BASE_URL}images/roy/timeline-hearts-sticker.webp`,
        alt: "מדבקה של רועי מוקף בלבבות"
      }
    },
    {
      id: "2018",
      year: "2018",
      type: "milestone",
      title: "לוחם אש נולד",
      description: "רועי מחליט להיות לוחם אש ומתגייס למערך כבאות והצלה",
      sticker: {
        src: `${import.meta.env.BASE_URL}images/roy/timeline-firefighter-sticker.webp`,
        alt: "מדבקה של רועי במדי לוחם אש"
      }
    }
  ],

  funFacts: [
    { id: "1", label: "פק״ל ערב של רועי", value: "אמרתם לרועי ערב חגיגי? אמרתם נרגילה וכוס אלכוהול צמודות!" },
    { id: "2", label: "אולי במציאות אחרת", value: "כאשר רועי חשב שהוא ולינור לעולם לא יוכלו להיות יחד בגלל סגנונות החיים השונים שלהם, היה נוהג לשיר לה במין עוקצנות הומוריסטית את שירו של אייל גולן ״אולי בזמן אחר, אולי במציאות אחרת״. הוא לא ידע כמה שהוא טעה" }
  ],

  dictionary: [
    {
      id: "1",
      term: "״אמור מעט, עשה הרבה״",
      type: "ביטוי",
      // No family-approved definition has been supplied yet.
      definition: ""
    }
  ],

  gallery: [
    { id: "photo-0", src: `${import.meta.env.BASE_URL}images/roy/gallery-0.webp`, alt: "שני אנשים מחובקים מול קיר אבן", width: 738, height: 947, orientation: "portrait" },
    { id: "photo-1", src: `${import.meta.env.BASE_URL}images/roy/gallery-1.webp`, alt: "אדם בחולצה שחורה נושא ילד על כתפיו", width: 1063, height: 687, orientation: "landscape" },
    { id: "photo-2", src: `${import.meta.env.BASE_URL}images/roy/gallery-2.webp`, alt: "חיבוק עם ילד לבוש בירוק", width: 697, height: 1049, orientation: "portrait" },
    { id: "photo-3", src: `${import.meta.env.BASE_URL}images/roy/gallery-3.webp`, alt: "צילום משותף של שני אנשים מחייכים", width: 1077, height: 1071, orientation: "square" },
    { id: "photo-4", src: `${import.meta.env.BASE_URL}images/roy/gallery-4.webp`, alt: "ארבעה אנשים מצטלמים סביב שולחן", width: 1080, height: 807, orientation: "landscape" },
    { id: "photo-5", src: `${import.meta.env.BASE_URL}images/roy/gallery-5.webp`, alt: "דיוקן בחולצה שחורה על רקע בלונים", width: 557, height: 768, orientation: "portrait" },
    { id: "photo-7", src: `${import.meta.env.BASE_URL}images/roy/gallery-7.webp`, alt: "אדם חבוש קסדה ורתום ברתמה בגובה", width: 1080, height: 810, orientation: "landscape" },
    { id: "photo-8", src: `${import.meta.env.BASE_URL}images/roy/gallery-8.webp`, alt: "צילום משותף של אדם בחולצה אפורה ואישה בכחול", width: 1078, height: 1440, orientation: "portrait" },
    { id: "photo-9", src: `${import.meta.env.BASE_URL}images/roy/gallery-9.webp`, alt: "צילום משותף של שני אנשים בבגדים בהירים", width: 1080, height: 1226, orientation: "portrait" },
  ],

  places: [
    {
      id: "home",
      name: "בית",
      latitude: 31.6531990,
      longitude: 34.5847310,
      description: "הבית בו נולד וגדל רועי, ולמעשה בית המשפחה עד עצם היום הזה"
    },
    {
      id: "beersheba-fire-station",
      name: "תחנת כיבוי אש באר שבע",
      latitude: 31.2485375,
      longitude: 34.819215,
      description: "המקום בו עבד רועי, ממנו יצא לנסיעתו האחרונה באותו בוקר ארור"
    }
  ],

  spotify: {
    playlistUrl: "https://open.spotify.com/playlist/23gm6IjuMcypZx2aqrVSL6",
    playlistUri: "spotify:playlist:23gm6IjuMcypZx2aqrVSL6",
    intro: "מוזיקה הייתה חלק בלתי נפרד מחייו של רועי. הוא אהב מאוד את אייל גולן, פאר טסי והרבה מוזיקה מזרחית של פעם מה שנקרא. תוכלו לקבל טעימה בנגן פה למטה",
    musicStory: "המוזיקה היא כמו זיכרון – היא נשארת איתנו גם כשהאדם שהיא מזכירה כבר איננו"
  },

  october7: {
    text: `בבוקר אותה שבת שחורה, רועי סיים משמרת לילה בתחנת הכיבוי בבאר שבע. כששמע את האזעקות מיהר לבית הוריו שבאשקלון, שם חיכתה לו משפחתו המורחבת כדי לחגוג ביחד את החג. סמוך לצומת גבים נתקל במחבלים שירו לעברו. הוא יצא ממכוניתו ונמלט לשדה סמוך, אך המחבלים ראו אותו וירו בו מאחור.
לינור אלמנתו סיפרה: "רועי נמלט לשדה באזור מושב יכיני ונורה בפלג גופו העליון. בעודו מתבוסס בדמו הוא שלף את הטלפון ושלח אליי הודעה קולית, שבה נפרד ממני ומהילדים... הוא אמר שהוא אוהב אותי, אוהב את הילדים, 'תשמרי עליהם', 'תתקדמי הלאה' ועוד דברים. בסוף ההודעה הביע את אהבתו הרבה אלי, וביקש שאמסור את אהבתו להוריו. הוא כבר היה פצוע כנראה. ידע שזה הסוף. כזה היה רועי שלי - הוא נתן לי סיומת רומנטית ואוהבת שתישאר איתי כל החיים".

במשך יומיים רועי נחשב לנעדר עד שנמצאה גופתו.

רועי משה נרצח על ידי מחבלים בדרכו לביתו באשקלון בכ"ב בתשרי תשפ"ד (07.10.2023), בן 36 בהירצחו. הוא הובא למנוחות בבית העלמין "גבעת ציון" באשקלון. לאחר מותו הועלה לדרגת רס"ר במערך כיבוי אש.

רועי הותיר אחריו אישה הרה, בן ובת, הורים, שתי אחיות וארבעה אחים. כשלושה חודשים לאחר הירצחו נולדה בתו, שהוא הספיק לבחור לה את שמה: גילי.`
  },

  // Add family-approved memorial photos, videos, and sites here as they are supplied.
  tributes: [
    {
      id: "youtube-5Wlqsm8itwQ",
      kind: "youtube",
      title: "סרטון קצר לזכרו",
      videoId: "5Wlqsm8itwQ"
    },
    {
      id: "maccabi-haifa-memorial",
      kind: "carousel",
      title: "מועדון הכדורגל מכבי חיפה מנציח את רועי, שהיה אוהד מסור של הקבוצה",
      photos: [
        { id: "maccabi-haifa-1", src: `${import.meta.env.BASE_URL}images/roy/tributes/maccabi-haifa-1.webp`, alt: "קיר צעיפים לזכר אוהדי מכבי חיפה, ובמרכזו צעיף הנושא את שמו של רועי משה", width: 1536, height: 2048 },
        { id: "maccabi-haifa-2", src: `${import.meta.env.BASE_URL}images/roy/tributes/maccabi-haifa-2.webp`, alt: "אישה מצביעה על הצעיף לזכר רועי משה בקיר ההנצחה של מכבי חיפה", width: 1536, height: 2048 },
        { id: "maccabi-haifa-3", src: `${import.meta.env.BASE_URL}images/roy/tributes/maccabi-haifa-3.webp`, alt: "תקריב של צעיף ירוק לזכר רועי משה ועליו השנים 1987–2023", width: 2048, height: 1536 },
        { id: "maccabi-haifa-4", src: `${import.meta.env.BASE_URL}images/roy/tributes/maccabi-haifa-4.webp`, alt: "שמו של רועי משה והשנים 1987–2023 מוצגים על מסך ביציע האצטדיון", width: 1600, height: 900 },
        { id: "maccabi-haifa-5", src: `${import.meta.env.BASE_URL}images/roy/tributes/maccabi-haifa-5.webp`, alt: "אישה יוצרת לב בידיה לצד הצעיף לזכר רועי משה", width: 1536, height: 2048 },
        { id: "maccabi-haifa-6", src: `${import.meta.env.BASE_URL}images/roy/tributes/maccabi-haifa-6.webp`, alt: "שני אנשים עומדים לצד הצעיף לזכר רועי משה בקיר ההנצחה", width: 1536, height: 2048 },
        { id: "maccabi-haifa-7", src: `${import.meta.env.BASE_URL}images/roy/tributes/maccabi-haifa-7.webp`, alt: "מבט רחב על קיר ההנצחה של מכבי חיפה ובו הצעיף לזכר רועי משה", width: 2048, height: 1536 }
      ]
    },
    {
      id: "roadside-memorial",
      kind: "carousel",
      title: "אנדרטה לזכרו במקום הירצחו",
      photos: [
        { id: "roadside-memorial-1", src: `${import.meta.env.BASE_URL}images/roy/tributes/roadside-memorial-1.webp`, alt: "שלט הנצחה לרועי משה לצד דגל ישראל המתנופף בשדה", width: 1200, height: 1600 },
        { id: "roadside-memorial-2", src: `${import.meta.env.BASE_URL}images/roy/tributes/roadside-memorial-2.webp`, alt: "שלט ההנצחה בשדה לצד דגל מכבי חיפה ודגל ישראל", width: 1200, height: 1600 },
        { id: "roadside-memorial-3", src: `${import.meta.env.BASE_URL}images/roy/tributes/roadside-memorial-3.webp`, alt: "תקריב של שלט ההנצחה לרועי משה והדגלים שמעליו", width: 1200, height: 1600 },
        { id: "roadside-memorial-4", src: `${import.meta.env.BASE_URL}images/roy/tributes/roadside-memorial-4.webp`, alt: "האנדרטה המוארת בשעת ערב עם שלטי ההנצחה והדגלים", width: 1600, height: 1200 },
        { id: "roadside-memorial-5", src: `${import.meta.env.BASE_URL}images/roy/tributes/roadside-memorial-5.webp`, alt: "שלט ההנצחה לרועי משה ודגל ישראל על רקע שמיים כחולים", width: 1200, height: 1600 },
        { id: "roadside-memorial-6", src: `${import.meta.env.BASE_URL}images/roy/tributes/roadside-memorial-6.webp`, alt: "אדם ניצב ליד שלט ההנצחה ומניף את דגל מכבי חיפה", width: 1200, height: 1600 },
        { id: "roadside-memorial-7", src: `${import.meta.env.BASE_URL}images/roy/tributes/roadside-memorial-7.webp`, alt: "שני שלטי הנצחה לרועי משה בשדה תחת שמיים כחולים", width: 1440, height: 2560 },
        { id: "roadside-memorial-8", src: `${import.meta.env.BASE_URL}images/roy/tributes/roadside-memorial-8.webp`, alt: "תקריב של שלט ההנצחה עם דגל מכבי חיפה ודגל ישראל", width: 1200, height: 1600 }
      ]
    }
  ],

  legacy: [],
  
  footer: {
    closingSentence: "",
    madeWithLove: "נבנה באהבה על ידי המשפחה והחברים של רועי.",
    social: []
  }
};
