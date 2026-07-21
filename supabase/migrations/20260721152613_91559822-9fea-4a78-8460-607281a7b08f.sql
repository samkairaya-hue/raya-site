
-- Site content sections (key/value JSON store)
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "auth write site_content" ON public.site_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Matrix cards (page 3, 8 items)
CREATE TABLE public.matrix_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INT NOT NULL DEFAULT 0,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  target_title TEXT NOT NULL DEFAULT '',
  target_body TEXT NOT NULL DEFAULT '',
  target_image_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.matrix_cards TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.matrix_cards TO authenticated;
GRANT ALL ON public.matrix_cards TO service_role;
ALTER TABLE public.matrix_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read matrix" ON public.matrix_cards FOR SELECT USING (true);
CREATE POLICY "auth write matrix" ON public.matrix_cards FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Outcome cards (page 5, 5 items)
CREATE TABLE public.outcome_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INT NOT NULL DEFAULT 0,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  target_title TEXT NOT NULL DEFAULT '',
  target_body TEXT NOT NULL DEFAULT '',
  target_image_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.outcome_cards TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.outcome_cards TO authenticated;
GRANT ALL ON public.outcome_cards TO service_role;
ALTER TABLE public.outcome_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read outcomes" ON public.outcome_cards FOR SELECT USING (true);
CREATE POLICY "auth write outcomes" ON public.outcome_cards FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Magazine / article cards (page 6, add/remove)
CREATE TABLE public.magazine_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INT NOT NULL DEFAULT 0,
  tag TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  target_title TEXT NOT NULL DEFAULT '',
  target_body TEXT NOT NULL DEFAULT '',
  target_image_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.magazine_cards TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.magazine_cards TO authenticated;
GRANT ALL ON public.magazine_cards TO service_role;
ALTER TABLE public.magazine_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read magazine" ON public.magazine_cards FOR SELECT USING (true);
CREATE POLICY "auth write magazine" ON public.magazine_cards FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- FAQ (add/remove/reorder)
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INT NOT NULL DEFAULT 0,
  question TEXT NOT NULL DEFAULT '',
  answer TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "auth write faqs" ON public.faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed default content from the design
INSERT INTO public.site_content(key, data) VALUES
('theme', jsonb_build_object(
  'bg_cream','#FDFBF7','bg_sand','#F4F0EA','text_dark','#1E293B','text_muted','#52525B',
  'accent_primary','#E07A5F','accent_hover','#D56A4E','footer_bg','#1E293B'
)),
('settings', jsonb_build_object(
  'admin_email','',
  'submit_button_text','שילחי לי פנייה ואחזור אלייך בהקדם',
  'submit_success_text','ההודעה נשלחה בהצלחה! אחזור אלייך בהקדם'
)),
('hero', jsonb_build_object(
  'subtitle','רעיה ברכה | קליניקה לטיפול רגשי בשיטת EMID',
  'title','להשתחרר מהלופים הרגשיים ולחזור לתפקוד',
  'subheading','לנטרל את החרדה, התקיעות והמטענים מהשורש הנוירולוגי',
  'body','טיפול רגשי ממוקד, קצר מועד ומטרתי, המיועד למבוגרים המתמודדים עם חסמים וזקוקים לפתרון יציב, מעמיק ותפקודי.',
  'button_text','לקביעת פגישת היכרות',
  'image_url','https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600'
)),
('emid', jsonb_build_object(
  'title','איך זה עובד? שיטת EMID',
  'body','טיפול בדיבור פונה לחלקים המודעים של המוח, אך דפוסים אוטומטיים, חרדות וטראומות ננעלים בחלקים עמוקים יותר. בשיטת EMID אנחנו פועלים ברמה הנוירולוגית והפיזיולוגית כדי להתיר את ה"קשרים" התקועים.

באמצעות תנועות עיניים מונחות המחקות את מנגנון העיבוד הטבעי של המוח (כפי שמתרחש בשנת REM), אנחנו מעבדים ומקודדים מחדש זיכרונות ומטענים רגשיים שנשמרו בגוף כמצב חרום כרוני.

כשהקוד ב"חומרה" משתנה, המוח מפסיק לזהות את הסיטואציה כסכנה והתגובה האוטומטית פשוט מתפוגגת. התהליך מאפשר לפרק חסמים עמוקים מבלי צורך "לנבור" במשך שנים בעבר.'
)),
('matrix_header', jsonb_build_object(
  'title','במה הטיפול עוזר?',
  'subtitle','זיהוי וניטרול השורש הרגשי והנוירולוגי שמניע את הקשיים היומיומיים.'
)),
('bridge', jsonb_build_object(
  'title','זה לא האופי שלך – זה רק המנגנון',
  'body','רבים בטוחים שהחרדה, ההתפרצויות או הדחיינות הם פשוט "מי שהם". הם אומרים לעצמם: "ככה אני, זה האופי שלי".

האמת היא אחרת: המוח שלנו הוא איבר גמיש להפליא. מה שנראה לך כיום כגזירת גורל, הוא ברוב המקרים פשוט חיווט הישרדותי ישן שתקוע במערכת.

בשיטת EMID אנחנו לא לומדים "לחיות לצד הכאב" ולא מנסים לשנות אותך בכוח. אנחנו פשוט מעבדים מחדש את הקבצים שגורמים למערכת שלך להשתבש. כששורש הבעיה מנוטרל ברמה הנוירולוגית, השינוי לא דורש מאמץ – הוא פשוט קורה.'
)),
('outcomes_header', jsonb_build_object(
  'title','מה מחכה בצד השני?',
  'subtitle','האיזון והרווחה הרגשית שנפתחים כשהמטען הנוירולוגי משתחרר.'
)),
('magazine_header', jsonb_build_object(
  'title','תובנות וידע מתוך הקליניקה',
  'subtitle','הסברים מעמיקים בגובה העיניים על הפיזיולוגיה והנוירולוגיה של השינוי.'
)),
('about', jsonb_build_object(
  'title','נעים להכיר, רעיה ברכה',
  'body','אני מאמינה שטיפול רגשי לא חייב להיות תהליך ממושך ומתיש שנמשך שנים ארוכות כדי להביא לשינוי משמעותי. בקליניקה שלי, הטיפול מתנהל בגובה העיניים, באווירה בטוחה, מכילה לחלוטין וללא שום שיפוטיות, מתוך מטרה אחת מרכזית: לעזור לכם לחזור לתפקוד מלא ולמצוא מחדש את השקט הפנימי שלכם.

בין אם אתם מתמודדים עם לולאות בלתי נגמרות של חרדה שמנהלות את סדר היום, חווים תקיעות מתסכלת בצומת דרכים אישי או מקצועי, או מוצאים את עצמכם נשאבים לדחיינות כרונית וחוסר אנרגיה – אנחנו נפרק יחד את החסמים הללו מהשורש הפיזיולוגי והרגשי שלהם.',
  'credentials','מטפלת רגשית, מומחית בשיטת EMID לשחרור חסמים וטראומות.',
  'image_url','https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=600'
)),
('faq_header', jsonb_build_object(
  'title','שאלות שעולות לעיתים קרובות',
  'subtitle','תשובות שקופות ומפורטות שיעזרו לך להבין את התהליך לעומק.'
)),
('contact', jsonb_build_object(
  'title','בוא/י נפרק את הלופ ונחזיר את השקט לחיים',
  'subtitle','אני מזמינה אותך לשיחת היכרות קצרה וממוקדת בטלפון, שבה נבין יחד את הקושי ונראה איך נוכל להתקדם.',
  'name_label','שם מלא',
  'phone_label','מספר טלפון',
  'message_label','מה הדבר שהכי היית רוצה לשחרר כרגע?'
)),
('footer', jsonb_build_object(
  'right','רעיה ברכה',
  'center','© כל הזכויות שמורות'
));

INSERT INTO public.matrix_cards(sort_order, slug, title, description) VALUES
(1,'anxiety','חרדות והתקפי פאניקה','נטרול תגובת הסטרס של הגוף במצבים יומיומיים והחזרת תחושת השליטה והביטחון.'),
(2,'ptsd','פוסט טראומה (PTSD)','שחרור מזיכרונות מטרידים ואירועי עבר שממשיכים לנהל את איכות החיים שלך בהווה.'),
(3,'anger','התפרצויות זעם וויסות','הפסקת ה"אוטומט" שגורם לתגובות קיצוניות, כעס בלתי נשלט או איבוד עשתונות.'),
(4,'sexual-trauma','נפגעי ונפגעות פגיעה מינית','עיבוד עמוק, עדין ומדויק של טראומות מורכבות במרחב בטוח ומאפשר לנטרול המטען.'),
(5,'addiction','התמכרויות והרגלים','זיהוי ונטרול השורש המניע בריחה (אוכל, מסכים, קניות) ושבירת המעגל האוטומטי.'),
(6,'loss','התגברות על אובדן או פרידה','עיבוד רגשי של פרידות כואבות ותהליכי אבל, המאפשר לשחרר את המשקל הכבד.'),
(7,'stuck','דחיינות, דיכאון ותקיעות','טיפול בתחושת הכבדות שמונעת ממך לחוות את החיים בעוצמה ובחופש שהיית רוצה.'),
(8,'relationships','דפוסים במערכות יחסים','זיהוי וניטרול האוטומטים שגורמים לך לחזור על אותן טעויות בזוגיות ובהורות.');

INSERT INTO public.outcome_cards(sort_order, slug, title, description) VALUES
(1,'quiet','שקט פיזי ונינוחות','המתח בגוף יורד. הנשימה הופכת עמוקה וטבעית יותר.'),
(2,'balanced','תגובות מאוזנות','ניהול רגוע של אתגרי היום-יום, בלי להיחטף לאוטומט.'),
(3,'present','נוכחות ברגע','פחות רעש מחשבתי. יותר יכולת להתרכז וליהנות מהקיים.'),
(4,'communication','תקשורת זורמת','קשרים פשוטים ונינוחים יותר עם האנשים הקרובים אליכם.'),
(5,'freedom','פניות נפשית','האנרגיה מתפנה מהישרדות לקידום הדברים שחשובים לכם.');

INSERT INTO public.magazine_cards(sort_order, slug, tag, title, description, image_url) VALUES
(1,'neurology-of-gaze','נימה מדעית','הנוירולוגיה של המבט: כיצד תנועות עיניים משנות חיווט?','מפרט את תהליך ה-REM, קוד 1099, העומס על זיכרון העבודה והגירוי הבילטרלי שמפרק את המטען הרגשי מהשורש.','https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600'),
(2,'session-length','נימה מקצועית ובטיחותית','למה "שעה טיפולית" לא מספיקה לעיבוד טראומה?','חשיבות מפגשי שעתיים: פתיחת קובץ, רצף עיבודי ללא הפרעות, וסגירה הרמטית (Closure) למניעת הצפה בחוץ.','https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=600'),
(3,'not-your-character','נימה משחררת ומלאת תקווה','"זה פשוט האופי שלי": המלכודת שגורמת לנו להשלים עם הסבל','פירוק התפיסה השגויה שדפוסי הישרדות (זעם, חרדה, דחיינות) הם "תכונות אופי", ואיך Decoding מחזיר אותך לעצמך.','https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600');

INSERT INTO public.faqs(sort_order, question, answer) VALUES
(1,'1. האם הטיפול ישנה את מי שאני?','ממש לא. המטרה ב-EMID היא לא "לתכנת" אתכם מחדש או לשנות את האופי שלכם, אלא להסיר את ה"רעש" הנוירולוגי שמפריע לכם להיות אתם. החרדה, הזעם או הדחיינות הם לא האישיות שלכם – הם מנגנוני הישרדות שתקועים במערכת. כשאנחנו מנטרלים אותם, אתם לא הופכים לאדם אחר; אתם פשוט חוזרים להיות עצמכם, רק בלי המטען שניהל אתכם עד עכשיו.'),
(2,'2. כמה זמן נמשך התהליך?','EMID היא שיטה ממוקדת וקצרת מועד. אנחנו לא שואפים לשנים של טיפול; המטרה היא לייצר שינוי מוחשי בשטח כבר מהמפגשים הראשונים. משך התהליך משתנה, אך הכוונה היא תמיד להגיע לתוצאה יציבה בזמן הקצר ביותר האפשרי.'),
(3,'3. מה אם אני לא זוכר/ת את האירוע שיצר את הבעיה?','זהו אחד היתרונות של השיטה. המוח והגוף שלך שומרים את ה"קוד" של האירוע גם אם המודע הדחיק אותו. השיטה מאפשרת לנו להציף את הזיכרונות הרלוונטיים שזקוקים לעיבוד, גם אם הם נשכחו מזמן או נראים כרגע לא קשורים לדפוס שמנהל אותך.'),
(4,'4. כבר ניסיתי טיפולים אחרים שלא עזרו. למה שזה יעבוד?','טיפול בדיבור פונה לחלקים המודעים של המוח, אבל דפוסים אוטומטיים וטראומות ננעלים בחלקים עמוקים יותר. EMID פועלת ברמה הנוירולוגית ומשנה את הדרך שבה המידע מאוחסן. כשהקוד ב"חומרה" משתנה, גם ההרגשה והתגובות משתנות – גם אם ניסית להבין אותן שוב ושוב בעבר ללא הצלחה.'),
(5,'5. האם התוצאות נשמרות לאורך זמן?','כן. ברגע שקוד האחסון של האירוע נשבר (Decoding) והזיכרון תוייק מחדש כזיכרון עבר רגיל, המטען הרגשי שלו פשוט מתפוגג. המוח מפסיק לזהות את הסיטואציה כ"סכנה", ולכן הגוף מפסיק להפעיל את התגובה האוטומטית. זהו שינוי מבני, לא זמני.'),
(6,'6. למה פגישת טיפול נמשכת שעתיים?','בניגוד לשיטות טיפול מסורתיות המסתיימות אחרי 50 דקות, ב-EMID אנחנו עובדים במפגשים מרוכזים של שעתיים. הסיבה לכך היא בטיחותית ומקצועית: עיבוד של מטען רגשי או טראומטי דורש זמן כדי להגיע לסגירה מלאה (Closure). במפגש ארוך אנחנו מוודאים שהתהליך שהתחלנו מסתיים בתוך הקליניקה, כך שתוכלו לצאת החוצה כשאתם רגועים ומאוזנים, מבלי "להסתובב" עם ההצפה הרגשית עד לשבוע הבא. זהו טיפול עמוק שמכבד את הקצב של המוח שלכם ומבטיח שכל קובץ שנפתח – גם מעובד עד הסוף.');
