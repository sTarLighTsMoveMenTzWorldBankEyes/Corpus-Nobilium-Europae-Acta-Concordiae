const fs = require('fs');
const path = require('path');

// Let's create helper to slugify
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Global dataset provided by user
const globalHousesRaw = [
  {
    name: 'Yamato',
    altNames: ['Japanese Imperial House', 'Imperial House of Japan', 'Kōshitsu', '天皇皇室'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Japan',
    type: 'Kaiser- & Königshaus',
    status: 'Regierend / Souverän',
    period: '660 v. Chr.–heute',
    institution: 'Imperial Household Agency (Kunaichō)',
    seat: 'Kaiserpalast Tokio (皇居, Kōkyo)',
    urls: {
      official: 'https://www.kunaicho.go.jp',
      archive: 'https://web.archive.org/web/20161120104322/http:/www.kunaicho.go.jp/eindex.html',
      museum: 'https://www.kunaicho.go.jp/en/learn/institution/shisetsu/kyuden-ph.html',
      encyclopedia: 'https://en.wikipedia.org/wiki/Imperial_House_of_Japan'
    },
    crestMotif: 'Kiku-mon (kaiserliches Chrysanthemenwappen mit 16 Blütenblättern)',
    description: 'Die älteste kontinuierlich regierende Monarchie der Welt; der Tennō (Kaiser) ist das symbolische Staatsoberhaupt Japans.',
    source: 'kunaicho.go.jp'
  },
  {
    name: 'Chakri',
    altNames: ['Chakri-Dynastie', 'Royal House of Chakri', 'ราชวงศ์จักรี'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Thailand',
    type: 'Kaiser- & Königshaus',
    status: 'Regierend / Souverän',
    period: '1782–heute',
    institution: 'Royal Office of the King of Thailand / Bureau of the Royal Household',
    seat: 'Großer Palast Bangkok / Sra Pathum Palast',
    urls: {
      official: 'https://thailand.go.th/issue-focus/royal-office',
      foundation: 'http://kanchanapisek.or.th/',
      encyclopedia: 'https://en.wikipedia.org/wiki/Chakri_dynasty'
    },
    email: 'webmaster@kanchanapisek.or.th',
    crestMotif: 'Chakra (Diskus) und Trishula (Dreizack) als dynastisches Emblem',
    description: 'Die regierende Königsdynastie Thailands seit 1782, gegründet von König Rama I. mit der Errichtung Bangkoks als Hauptstadt.',
    source: 'thailand.go.th'
  },
  {
    name: 'Saud (Al Saud)',
    altNames: ['House of Saud', 'Al Saud', 'آل سعود', 'Saudi Royal Family'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Saudi-Arabien',
    type: 'Kaiser- & Königshaus',
    status: 'Regierend / Souverän',
    period: '1720–heute',
    institution: 'Royal Court of Saudi Arabia',
    seat: 'Erdpalast (Qasr al-Ard), Riad',
    urls: {
      official: 'https://www.saudiembassy.sa/',
      foundation: 'https://houseofsaud.com/royal-family/',
      encyclopedia: 'https://en.wikipedia.org/wiki/House_of_Saud'
    },
    crestMotif: 'Palmenbaum über zwei gekreuzten Säbeln (Saudi-Arabisches Staatswappen)',
    description: 'Die regierende Königsfamilie Saudi-Arabiens seit 1932; gegründet von König Abdulaziz (Ibn Saud) und heute eine der wohlhabendsten Dynastien der Welt.',
    source: 'saudiembassy.sa'
  },
  {
    name: 'Haschemiten (Jordanien)',
    altNames: ['Hashimiten', 'Hashemite Dynasty', 'الهاشميون', 'Ahl al-Bayt'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Jordanien',
    type: 'Kaiser- & Königshaus',
    status: 'Regierend / Souverän',
    period: '1916–heute (als Dynastie seit dem 7. Jh.)',
    institution: 'The Royal Hashemite Court (Diwan al-Maliki)',
    seat: 'Raghadan-Palast, Amman',
    urls: {
      official: 'https://rhc.jo/en',
      foundation: 'https://rhc.jo/en/king-abdullah',
      encyclopedia: 'https://en.wikipedia.org/wiki/Hashemites'
    },
    crestMotif: 'Haschemitisches Wappen mit Krone und Stern',
    description: 'Die regierende Königsfamilie Jordaniens seit 1921; direkte Nachkommen des Propheten Mohammed in 41. Generation; ehemals auch Könige des Irak und Hedschas.',
    source: 'rhc.jo'
  },
  {
    name: 'Mughal',
    altNames: ['Mogul-Dynastie', 'Mughal Empire', 'Timurid Dynasty of India', 'گورکانیان'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Indien',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: '1526–1858',
    institution: "Humayun's Tomb World Heritage Site Museum / Aga Khan Trust for Culture",
    seat: 'Rotes Fort (Lal Qila), Delhi / Agra Fort',
    urls: {
      official: 'https://www.htmuseum.org/',
      foundation: 'https://the.akdn',
      museum: 'https://www.htmuseum.org/about-us',
      encyclopedia: 'https://en.wikipedia.org/wiki/Mughal_Empire'
    },
    crestMotif: 'Sonne im Wappen der Mogulkaiser (Shams-ud-Din)',
    description: 'Die Mogul-Dynastie war ein von Babur (Nachkomme Timurs und Dschingis Khans) gegründetes Kaiserreich, das weite Teile des indischen Subkontinents beherrschte; berühmt für Kunst, Architektur (Taj Mahal) und Kultur.',
    source: 'htmuseum.org'
  },
  {
    name: 'Qing',
    altNames: ['Qing-Dynastie', 'Manchu Dynasty', 'Aisin Gioro', '清朝', 'Mandschu-Dynastie'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'China',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: '1644–1912',
    institution: 'The Palace Museum (Forbidden City) / 故宫博物院',
    seat: 'Verbotene Stadt (Zijincheng), Peking',
    urls: {
      official: 'https://intl.dpm.org.cn/index.h',
      museum: 'https://www.dpm.org.cn/Home.html',
      encyclopedia: 'https://en.wikipedia.org/wiki/Qing_dynasty'
    },
    crestMotif: 'Kaiserlicher Drache mit fünf Klauen auf goldenem Grund',
    description: 'Die letzte Kaiserdynastie Chinas, gegründet von den Mandschu unter dem Clan Aisin Gioro; beherrschte China von 1644 bis zur Revolution 1912.',
    source: 'dpm.org.cn'
  },
  {
    name: 'Joseon (Haus Yi)',
    altNames: ['Yi-Dynastie', 'House of Yi', 'Jeonju Yi Clan', '전주이씨', 'Korean Empire'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Korea',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: '1392–1910',
    institution: 'National Palace Museum of Korea / Jeonju Lee Royal Family Association',
    seat: 'Gyeongbokgung-Palast, Seoul',
    urls: {
      official: 'https://gogung.go.kr/gogungEn/main/main.do',
      foundation: 'https://jeonjulee.imweb.me/',
      museum: 'https://gogung.go.kr/gogungEn/main/main.do',
      encyclopedia: 'https://en.wikipedia.org/wiki/Joseon_dynasty'
    },
    email: 'rfo@rfo.co.kr',
    crestMotif: 'Koreanischer Drache (Yong) als kaiserliches Symbol, Pflaumenblüten-Emblem',
    description: 'Die Joseon-Dynastie wurde 1392 von Yi Seong-gye (König Taejo) gegründet und regierte Korea über 500 Jahre lang; 1897 zum Koreanischen Kaiserreich erhoben, 1910 von Japan annektiert.',
    source: 'gogung.go.kr'
  },
  {
    name: 'Pahlavi',
    altNames: ['Pahlavi-Dynastie', 'خاندان پهلوی', 'Imperial House of Pahlavi'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Iran',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: '1925–1979',
    institution: 'Reza Pahlavi Official Website / Farah Pahlavi Foundation',
    seat: 'Ehem. Niavaran-Palast, Teheran (heute Museum)',
    urls: {
      official: 'https://rezapahlavi.org/en',
      foundation: 'https://www.farahpahlavifoundation.org/',
      museum: 'https://farahpahlavi.org/negarestan-museum-of-qajar-dynasty-arts/',
      encyclopedia: 'https://en.wikipedia.org/wiki/Pahlavi_dynasty'
    },
    crestMotif: 'Pahlavi-Krone mit Berg-und-Sonne-Emblem, Löwe und Sonne (Shir-o-Khorshid)',
    description: 'Die letzte iranische Königsdynastie, gegründet 1925 von Reza Schah Pahlavi; 1979 durch die Islamische Revolution gestürzt; vertreten durch Kronprinz Reza Pahlavi im Exil.',
    source: 'rezapahlavi.org'
  },
  {
    name: 'Osmanen (Haus Osman)',
    altNames: ['Osmanische Dynastie', 'Ottoman Dynasty', 'House of Osman', 'Osmanoğlu', 'عثمان خان'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Türkei',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: 'ca. 1299–1924',
    institution: 'Directorate of National Palaces (Milli Saraylar Başkanlığı)',
    seat: 'Topkapı-Palast / Dolmabahçe-Palast, Istanbul',
    urls: {
      official: 'https://www.millisaraylar.gov.tr/',
      museum: 'https://www.millisaraylar.gov.tr/Lokasyon/2/topkapi-sarayi',
      encyclopedia: 'https://en.wikipedia.org/wiki/Ottoman_dynasty'
    },
    email: 'info@millisaraylar.gov.tr',
    crestMotif: 'Tughra (kalligraphisches Siegel des Sultans), Halbmond und Stern',
    description: 'Die osmanische Dynastie regierte das Osmanische Reich über 600 Jahre lang und war eine der langlebigsten und mächtigsten Dynastien der islamischen Welt; 1924 nach Gründung der Türkischen Republik abgeschafft.',
    source: 'millisaraylar.gov.tr'
  },
  {
    name: 'Kadscharen (Qajar)',
    altNames: ['Kadscharen-Dynastie', 'Qajar Dynasty', 'خاندان قاجار', 'Kadjaren'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Iran',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: '1789–1925',
    institution: 'National Museum of Iran / Qajar Museum',
    seat: 'Golestan-Palast, Teheran (UNESCO-Welterbe)',
    urls: {
      official: 'https://irannationalmuseum.ir/en/',
      museum: 'https://qajarmuseum.com/',
      encyclopedia: 'https://en.wikipedia.org/wiki/Qajar_dynasty'
    },
    crestMotif: 'Löwe und Sonne (Shir-o-Khorshid) auf kadscharischem Wappen, Kiani-Krone',
    description: 'Die Kadscharen-Dynastie regierte Persien von 1789 bis 1925 und wurde von Reza Schah Pahlavi abgelöst; bekannt für ihre unverwechselbare Kunst- und Architekturperiode.',
    source: 'irannationalmuseum.ir'
  },
  {
    name: 'Nguyen (Nguyễn-Dynastie)',
    altNames: ['Nguyễn-Dynastie', 'House of Nguyen', 'Nhà Nguyễn', 'Nguyễn Dynasty'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Vietnam',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: '1802–1945',
    institution: 'Hue Monuments Conservation Centre (Trung tâm Bảo tồn Di tích Cố đô Huế)',
    seat: 'Kaiserstadt Huế (UNESCO-Welterbe)',
    urls: {
      official: 'https://www.huedisan.com.vn/',
      museum: 'https://hueworldheritage.org.vn/en-us/',
      encyclopedia: 'https://en.wikipedia.org/wiki/Nguy%E1%BB%85n_dynasty'
    },
    crestMotif: 'Drache und Phönix als kaiserliche Symbole, goldener Drache der Nguyen',
    description: 'Die letzte vietnamesische Kaiserdynastie, gegründet von Kaiser Gia Long 1802; residierte in der Kaiserstadt Huế, die zum UNESCO-Welterbe gehört; 1945 unter Kaiser Bao Dai abgedankt.',
    source: 'hueworldheritage.org.vn'
  },
  {
    name: 'Borjigin (Dschingis Khan Clan)',
    altNames: ['Borjigin-Clan', 'Bordschigin', 'Mongol Dynasty', 'Genghisid', 'Чингисийн алтан ураг'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Mongolei',
    type: 'Kaiser- & Königshaus',
    status: 'Historischer Adel',
    period: 'ca. 900 n. Chr.–20. Jh.',
    institution: 'Chinggis Khaan National Museum / Chinggis Khaan Heritage and Cultural Institute',
    seat: 'Karakorum (historisch) / Ulaanbaatar',
    urls: {
      official: 'https://chinggismuseum.com/en',
      foundation: 'https://chinggisinstitute.gov.mn/en/page/introduction-61',
      museum: 'https://chinggismuseum.com/en',
      encyclopedia: 'https://en.wikipedia.org/wiki/Borjigin'
    },
    crestMotif: 'Tamgha (Siegel) der Borjigin, Falken-Emblem',
    description: 'Der mongolische Clan Borjigin, gegründet im 10. Jahrhundert, brachte Dschingis Khan hervor und stellte die Herrscher des Mongolenreiches, der Yuan-Dynastie und zahlreicher Khanate in Asien und Europa.',
    source: 'chinggismuseum.com'
  },
  {
    name: 'Safawiden',
    altNames: ['Safavid Dynasty', 'صفویان', 'Safaviden', 'Safavi'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Iran',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: '1501–1736',
    institution: 'National Museum of Iran / Museum of Islamic Archaeology and Art',
    seat: 'Ali-Qapu-Palast, Isfahan (Naghsh-e Jahan Platz)',
    urls: {
      official: 'https://irannationalmuseum.ir/en/',
      encyclopedia: 'https://en.wikipedia.org/wiki/Safavid_dynasty'
    },
    crestMotif: 'Safawidisches Wappen mit Löwe und Sonne, Dschingis-Khan-Stil-Krone',
    description: 'Die Safawiden-Dynastie vereinigte Iran unter schiitischem Islam und erlebte unter Schah Abbas I. eine goldene Ära der Kunst, Architektur und Handelsblüte mit der Hauptstadt Isfahan.',
    source: 'irannationalmuseum.ir'
  },
  {
    name: 'Tokugawa',
    altNames: ['Tokugawa-Shogunat', 'Tokugawa Clan', '徳川氏', 'Edo Shogunate'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Japan',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: '1603–1868',
    institution: 'The Tokugawa Art Museum (Tokugawa Reimeikai Foundation)',
    seat: 'Edo-Schloss (heute Kaiserpalast Tokio) / Nagoya-Schloss',
    urls: {
      official: 'https://www.tokugawa-art-museum.jp/',
      foundation: 'https://www.tokugawa.or.jp/index-right.htm',
      museum: 'https://www.tokugawa-art-museum.jp/',
      encyclopedia: 'https://en.wikipedia.org/wiki/Tokugawa_clan'
    },
    crestMotif: 'Mitsuba-Aoi (drei Malvenblätter im Kreis)',
    description: 'Das Tokugawa-Shogunat brachte Japan über 250 Jahre Frieden und Stabilität in der Edo-Periode; gegründet von Tokugawa Ieyasu, der Japan 1603 vereinigte.',
    source: 'tokugawa-art-museum.jp'
  },
  {
    name: 'Ming',
    altNames: ['Ming-Dynastie', '明朝', 'Ming Dynasty', 'Great Ming'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'China',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: '1368–1644',
    institution: 'Nanjing Municipal Museum (Chaotian Palace) / National Museum of China',
    seat: 'Verbotene Stadt (Zijincheng), Peking / Nanjing',
    urls: {
      official: 'https://www.njmuseumadmin.com/en/Stadium/index/id/2',
      museum: 'https://www.njmuseum.com/en',
      encyclopedia: 'https://en.wikipedia.org/wiki/Ming_dynasty'
    },
    crestMotif: 'Kaiserlicher Drache mit fünf Klauen, Ming-Vase-Motiv',
    description: 'Die Ming-Dynastie wurde von Zhu Yuanzhang (Kaiser Hongwu) gegründet und brachte China eine Blütezeit der Kunst, Literatur und Seefahrt; die Verbotene Stadt wurde unter Kaiser Yongle errichtet.',
    source: 'njmuseumadmin.com'
  },
  {
    name: 'Norodom',
    altNames: ['House of Norodom', 'Norodom-Dynastie', 'រាជវង្សនរោត្តម'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Kambodscha',
    type: 'Kaiser- & Königshaus',
    status: 'Regierend / Souverän',
    period: '1860–heute (mit Unterbrechung 1970–1993)',
    institution: 'Royal House of Norodom / National Museum of Cambodia',
    seat: 'Khemarin-Palast, Phnom Penh',
    urls: {
      official: 'https://www.norodomsihamoni.org/',
      museum: 'https://nmc.gov.kh/index.php/about-us',
      encyclopedia: 'https://en.wikipedia.org/wiki/Monarchy_of_Cambodia'
    },
    crestMotif: 'Königliches Wappen mit zwei Elefanten und Regenschirm-Symbol',
    description: 'Die Norodom-Dynastie ist eine der beiden königlichen Häuser Kambodschas; der amtierende König Norodom Sihamoni wurde 2004 vom Thronrat gewählt und ist Staatsoberhaupt der konstitutionellen Monarchie.',
    source: 'norodomsihamoni.org'
  },
  {
    name: 'Aga Khan (Ismaili Imamat)',
    altNames: ['Ismaili Imamat', 'Aga Khan Dynasty', 'آقاخان', 'Aga Khani'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Weltweit (Indien, Pakistan, Iran, Ostafrika)',
    type: 'Fürsten- & Herzogshaus',
    status: 'Regierend / Souverän (spirituell)',
    period: '1818–heute (als Imamat seit dem 7. Jh.)',
    institution: 'Aga Khan Development Network (AKDN) / The Institute of Ismaili Studies',
    seat: 'Lissabon (AKDN-Sitz) / Aiglemont, Chantilly (Frankreich)',
    urls: {
      official: 'https://the.akdn/en/who-we-are/ismaili-imamat',
      foundation: 'https://akf.org/',
      museum: 'https://www.iis.ac.uk/',
      encyclopedia: 'https://en.wikipedia.org/wiki/Aga_Khan'
    },
    crestMotif: 'Aga-Khan-Wappen mit Krone und arabischer Kalligraphie',
    description: 'Die Aga Khan-Dynastie ist die spirituelle Führungslinie der schiitischen Ismaili-Muslime; der Titel wurde 1818 vom Schah von Persien verliehen; der amtierende 50. Imam ist Prinz Rahim Aga Khan V.',
    source: 'the.akdn'
  },
  {
    name: 'Wangchuck',
    altNames: ['Wangchuck-Dynastie', 'House of Wangchuck', 'དབང་ཕྱུག་རྒྱལ་བརྒྱུད', 'Druk Gyalpo'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Bhutan',
    type: 'Kaiser- & Königshaus',
    status: 'Regierend / Souverän',
    period: '1907–heute',
    institution: 'Royal Office of Bhutan / The Gyalyum Charitable Trust',
    seat: 'Tashichho-Dzong, Thimphu',
    urls: {
      official: 'https://gyalyum.org/',
      archive: 'https://web.archive.org/web/20160513223148/http://royaloffice.bt/',
      foundation: 'https://gyalyum.org/',
      museum: 'https://www.bhutanwiki.org/articles/wangchuck-dynasty',
      encyclopedia: 'https://en.wikipedia.org/wiki/House_of_Wangchuck'
    },
    crestMotif: 'Königliches Wappen mit Donnerdrachen (Druk), Juwelen und Lotus',
    description: 'Die Wangchuck-Dynastie wurde 1907 gegründet, als Ugyen Wangchuck zum ersten erblichen Druk Gyalpo (Drachenkönig) von Bhutan gewählt wurde; der amtierende König Jigme Khesar Namgyel Wangchuck führte Bhutan zur konstitutionellen Demokratie.',
    source: 'gyalyum.org'
  },
  {
    name: 'Bolkiah',
    altNames: ['House of Bolkiah', 'Bolkiah Dynasty', 'Bolkiah Royal Family', 'Brunei Royal Family'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Brunei',
    type: 'Kaiser- & Königshaus',
    status: 'Regierend / Souverän',
    period: '14. Jh.–heute',
    institution: "Prime Minister's Office Brunei Darussalam / Istana Negara Brunei",
    seat: 'Istana Nurul Iman, Bandar Seri Begawan',
    urls: {
      official: 'https://www.pmo.gov.bn/',
      museum: 'https://www.pmo.gov.bn/prime-minister/',
      encyclopedia: 'https://en.wikipedia.org/wiki/House_of_Bolkiah'
    },
    crestMotif: 'Königliches Wappen mit Halbmond, Stern und Regenschirm (Payung Ubor-Ubor)',
    description: 'Das Haus Bolkiah ist die regierende Königsfamilie Bruneis und eine der ältesten kontinuierlich regierenden Dynastien der Welt; der amtierende Sultan Hassanal Bolkiah ist der 29. Sultan und absoluter Monarch.',
    source: 'pmo.gov.bn'
  },
  {
    name: 'Al Bu Said',
    altNames: ['Al Said Dynasty', 'Busaidi', 'آل بوسعيد', 'Albusaidi', 'House of Al Said'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Oman',
    type: 'Kaiser- & Königshaus',
    status: 'Regierend / Souverän',
    period: '1744–heute',
    institution: 'Royal Court Affairs (Diwan of Royal Court) / Sultanate of Oman',
    seat: 'Al-Alam-Palast, Muskat',
    urls: {
      official: 'https://www.rca.gov.om/rca_oman/hmh',
      museum: 'https://hmhaitham.om/',
      encyclopedia: 'https://en.wikipedia.org/wiki/Al_Bu_Sa%27id_Dynasty'
    },
    crestMotif: 'Khanjar (traditioneller Dolan) gekreuzt mit zwei Säbeln, roter Banner',
    description: 'Die Al-Bu-Said-Dynastie wurde 1744 von Ahmad bin Said Al Busaidi gegründet und ist eine der ältesten kontinuierlich regierenden Dynastien Arabiens; der amtierende Sultan Haitham bin Tariq regiert seit 2020.',
    source: 'rca.gov.om'
  },
  {
    name: 'Solomonische Dynastie (Äthiopien)',
    altNames: ['Solomonic Dynasty', 'House of Solomon', 'Ethiopian Imperial Family', 'Casa de Salomón'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Äthiopien',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: 'ca. 10. Jh. v. Chr. (legendär) – 1974',
    institution: 'The Crown Council of Ethiopia',
    seat: 'Addis Abeba (historisch: Menelik Palace)',
    urls: {
      official: 'https://ethiopiancrown.org',
      archive: 'https://web.archive.org/web/20050207025323/http:/www.imperialethiopia.org/index.htm',
      foundation: 'https://ethiopiancrown.org/echo/',
      encyclopedia: 'https://en.wikipedia.org/wiki/Solomonic_dynasty'
    },
    crestMotif: 'Löwe von Juda mit Kreuzstab und Banner, traditionell auf gelbem Feld.',
    description: 'Älteste afrikanische Dynastie, die ihre Abstammung auf König Salomon und die Königin von Saba zurückführt. Regierte bis zum Sturz Haile Selassies 1974.',
    source: 'ethiopiancrown.org'
  },
  {
    name: 'Zulu Royal Family',
    altNames: ['House of Zulu', 'Zulu Royal House', 'Nkosi Zulu'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Südafrika',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: 'ca. 18. Jh. – heute',
    institution: 'Private Office of His Majesty King Misuzulu kaZwelithini',
    seat: 'KwaKhethomthandayo Royal Palace, Nongoma',
    urls: {
      official: 'https://www.zulukingdom.co.za',
      foundation: 'https://kznzuluroyal.co.za',
      encyclopedia: 'https://en.wikipedia.org/wiki/Zulu_royal_family'
    },
    crestMotif: 'Schild mit Speeren und Zulu-Kriegssymbolen; traditionelle königliche Insignien.',
    description: 'Traditionelle Königsfamilie des Zulu-Volkes, begründet von König Shaka. Der amtierende König Misuzulu kaZwelithini ist das kulturelle Oberhaupt der Zulu-Nation.',
    source: 'zulukingdom.co.za'
  },
  {
    name: 'Ashanti Royal House',
    altNames: ['Asante Royal House', 'House of Osei Tutu', 'Sika Dwa Kofi'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Ghana',
    type: 'Fürsten- & Herzogshaus',
    status: 'Ehem. Regierend / Souverän',
    period: '17. Jh. – heute',
    institution: 'Manhyia Palace / Otumfuo Osei Tutu II Foundation',
    seat: 'Manhyia Palace, Kumasi',
    urls: {
      official: 'https://manhyiapalace.org',
      archive: 'https://www.manhyiaarchives.org',
      foundation: 'https://otumfuofoundation.org.gh',
      museum: 'https://www.manhyiaarchives.org',
      encyclopedia: 'https://en.wikipedia.org/wiki/Asante_Empire'
    },
    email: 'info@manhyiaarchives.org',
    crestMotif: 'Goldener Stuhl (Sika Dwa Kofi) als Symbol der Einheit; traditionelle Adinkra-Symbole.',
    description: 'Königshaus des Ashanti-Reiches, begründet von Osei Tutu I. Der Asantehene Otumfuo Osei Tutu II. ist der 16. König und sitzt auf dem Goldenen Stuhl.',
    source: 'manhyiapalace.org'
  },
  {
    name: 'Brasilianische Kaiserfamilie (Orléans-Bragança)',
    altNames: ['Brazilian Imperial Family', 'Casa Imperial do Brasil', 'Orléans-Braganza', 'House of Orléans-Braganza'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Brasilien',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: '1822–1889 (regierend); bis heute (Exil/Anspruch)',
    institution: 'Pró Monarquia / Secretariado da Casa Imperial do Brasil',
    seat: 'Imperial Palace of Grão-Pará, Petrópolis (Petrópolis-Linie)',
    urls: {
      official: 'https://monarquia.org.br',
      archive: 'https://monarquia.org.br/a-familia-imperial/anuario-da-casa-imperial/',
      encyclopedia: 'https://en.wikipedia.org/wiki/Brazilian_Imperial_House'
    },
    email: 'contato@monarquia.org.br',
    crestMotif: 'Grünes Wappen mit kaiserlicher Krone, kaiserliche Farben Grün und Gold.',
    description: 'Begründet von Kaiser Pedro I. (1822), der die Unabhängigkeit Brasiliens erklärte. Chef des Hauses ist Prinz Dom Bertrand von Orléans-Braganza.',
    source: 'monarquia.org.br'
  },
  {
    name: 'Mexikanisches Kaiserhaus (Iturbide)',
    altNames: ['Mexican Imperial House (Iturbide)', 'Casa de Iturbide', 'House of Habsburg-Iturbide', 'Imperial House of Mexico'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Mexiko',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: '1822–1823 (Erstes Kaiserreich); 1864–1867 (Zweites Kaiserreich)',
    institution: 'Casa Imperial de México',
    seat: 'Australien (Exil)',
    urls: {
      official: 'https://www.casaimperialdemexico.com',
      encyclopedia: 'https://en.wikipedia.org/wiki/House_of_Iturbide'
    },
    crestMotif: 'Adler auf Nopal-Kaktus, kaiserliche Krone; Wappen der Familie Iturbide mit baskischen Ursprüngen.',
    description: 'Begründet von Agustín I. de Iturbide 1822. Maximilian von Götzen-Iturbide ist der heutige Chef des Hauses und Nachfahre des Kaisers.',
    source: 'casaimperialdemexico.com'
  },
  {
    name: 'Tonga Royal Family (Tupou)',
    altNames: ['Tongan Royal Family', 'House of Tupou', "Tu'i Kanokupolu", "Tu'i Tonga"],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Tonga',
    type: 'Kaiser- & Königshaus',
    status: 'Regierend / Souverän',
    period: 'ca. 10. Jh. – heute (Tu\'i Tonga); 1845–heute (Tupou)',
    institution: 'Palace Office / Ministry of Information and Communications, Tonga',
    seat: 'Royal Palace, Nuku\'alofa',
    urls: {
      official: 'https://www.royalpalace.to',
      archive: 'https://web.archive.org/web/20071126092437/http:/palaceoffice.gov.to/',
      museum: 'https://www.royalpalace.to/royal_history.php',
      encyclopedia: 'https://en.wikipedia.org/wiki/Monarchy_of_Tonga'
    },
    crestMotif: 'Drei Schwerter für die drei Dynastien, Taube mit Olivenzweig, Sterne; königliche Krone.',
    description: 'Einzige verbleibende indigene Souveränität in Ozeanien. König Tupou VI. regiert seit 2012; die Dynastie geht auf drei alte Linien zurück: Tu\'i Tonga, Tu\'i Ha\'atakalaua und Tu\'i Kanokupolu.',
    source: 'royalpalace.to'
  },
  {
    name: 'Hawaiian Royal Family (Kamehameha)',
    altNames: ['House of Kamehameha', 'Kamehameha Dynasty', "Royal Family of Hawai'i"],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'USA (Hawaii)',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: '1795–1893 (Königreich Hawai\'i)',
    institution: 'Royal Family of Hawaii / Kamehameha Foundation',
    seat: 'Iolani Palace, Honolulu (historisch)',
    urls: {
      official: 'https://www.crownofhawaii.com',
      foundation: 'https://www.kamehamehafoundation.org',
      encyclopedia: 'https://en.wikipedia.org/wiki/House_of_Kamehameha'
    },
    crestMotif: 'Kamehameha-Wappen mit Speer, Federhelm und königlichem Mantel; Farben Gelb, Rot und Blau.',
    description: 'Begründet von König Kamehameha I., der die hawaiianischen Inseln 1795 einte. Die Dynastie endete 1893 mit dem Sturz von Königin Lili\'uokalani.',
    source: 'crownofhawaii.com'
  },
  {
    name: 'Māori King Movement (Kīngitanga)',
    altNames: ['Kīngitanga', 'Māori Royal Family', 'Te Wherowhero'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Neuseeland',
    type: 'Fürsten- & Herzogshaus',
    status: 'Historischer Adel',
    period: '1858–heute',
    institution: 'Kīngitanga',
    seat: 'Tūrangawaewae Marae, Ngāruawāhia',
    urls: {
      official: 'https://kiingitanga.com',
      encyclopedia: 'https://en.wikipedia.org/wiki/M%C4%81ori_King_Movement'
    },
    crestMotif: 'Kein traditionelles Wappen; königliche Insignien umfassen die Kiingitanga-Flagge und traditionelle Māori-Kunstwerke.',
    description: '1858 gegründete Bewegung zur Einigung der Māori-Stämme unter einem Monarchen. Die amtierende Königin Nga wai hono i te po wurde 2024 gewählt und ist die 8. Māori-Monarchin.',
    source: 'kiingitanga.com'
  },
  {
    name: 'Ooni of Ife (Yoruba)',
    altNames: ['Oonirisa', 'House of Ogunwusi', 'Ooni Dynasty'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Nigeria',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: 'ca. 7.–9. Jh. – heute',
    institution: 'Official Website of the Ooni of Ife / Royal African Foundation',
    seat: 'Ile-Oodua Palace, Ile-Ife, Osun State',
    urls: {
      official: 'https://www.oonirisa.org',
      foundation: 'https://www.royalafrican.foundation',
      museum: 'https://ooniofife.com',
      encyclopedia: 'https://en.wikipedia.org/wiki/Ooni_of_Ile-Ife'
    },
    email: 'info@ooniofife.com',
    crestMotif: 'Traditionelle Yoruba-königliche Insignien; königliche Krone (Ade) und Stab der Autorität (Opa Ase).',
    description: 'Der Ooni von Ile-Ife ist der spirituelle und kulturelle Hüter des Yoruba-Volkes weltweit. Ooni Adeyeye Enitan Ogunwusi Ojaja II. ist der 51. Ooni und direkter Nachfahre von Oduduwa.',
    source: 'oonirisa.org'
  },
  {
    name: 'Buganda Royal Family',
    altNames: ['House of Buganda', 'Bataka Royal Family', 'Kabaka Dynasty'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Uganda',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: 'ca. 14. Jh. – heute',
    institution: "Buganda Kingdom / Kabaka's Office",
    seat: 'Bulange Mengo, Kampala; Kasubi Royal Tombs (UNESCO-Welterbe)',
    urls: {
      official: 'https://buganda.or.ug',
      foundation: 'https://kabakasoffice.org',
      museum: 'https://buganda.or.ug/royal-tombs/',
      encyclopedia: 'https://en.wikipedia.org/wiki/Kabaka_of_Buganda'
    },
    email: 'info@buganda.or.ug',
    crestMotif: 'Löwe als Symbol des Kabaka; traditionelle Trommeln und königliche Insignien der Buganda.',
    description: 'Größtes traditionelles Königreich Ugandas, begründet von Kabaka Kintu. Kabaka Ronald Muwenda Mutebi II. ist der 36. König, 1993 nach Wiederherstellung des Königreichs inthronisiert.',
    source: 'buganda.or.ug'
  },
  {
    name: 'Eswatini Royal Family (Dlamini)',
    altNames: ['House of Dlamini', 'Nkosi Dlamini', 'Swazi Royal Family'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Eswatini',
    type: 'Kaiser- & Königshaus',
    status: 'Regierend / Souverän',
    period: 'ca. 1550 – heute',
    institution: 'Government of Eswatini / Royal Household',
    seat: 'Lozitha Royal Palace, Lobamba',
    urls: {
      official: 'https://www.gov.sz',
      foundation: 'https://40years.gov.sz',
      encyclopedia: 'https://en.wikipedia.org/wiki/House_of_Dlamini'
    },
    crestMotif: 'Nationalwappen mit Löwe und Elefant (Ngwenyama und Ndlovukazi), Schild und Speer.',
    description: 'Die Dlamini-Dynastie geht bis ca. 1550 zurück. König Mswati III. regiert seit 1986 und ist der letzte absolute Monarch Afrikas.',
    source: 'gov.sz'
  },
  {
    name: 'Lesotho Royal Family (Seeiso)',
    altNames: ['House of Moshoeshoe', 'Basotho Royal Family', 'Seeiso Dynasty'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Lesotho',
    type: 'Kaiser- & Königshaus',
    status: 'Regierend / Souverän',
    period: 'ca. 1824 – heute',
    institution: 'Office of the King / Royal Palace Secretariat',
    seat: 'Royal Palace, Maseru',
    urls: {
      official: 'https://theking.parliament.ls',
      archive: 'https://www.gov.ls/category/royal/',
      encyclopedia: 'https://en.wikipedia.org/wiki/Monarchy_of_Lesotho'
    },
    email: 'sps@palace.org.ls',
    crestMotif: 'Krokodil als nationales Symbol; königliche Insignien mit traditioneller Basotho-Decke und Stab.',
    description: 'Begründet von König Moshoeshoe I. im frühen 19. Jh. König Letsie III. ist das konstitutionelle Staatsoberhaupt und Symbol der Einheit der Basotho-Nation.',
    source: 'theking.parliament.ls'
  },
  {
    name: 'Alaouite Dynasty (Marokko)',
    altNames: ['Alawi Dynasty', "'Alawid Dynasty", 'Sharifian Dynasty of Morocco', 'سلالة العلويين الفيلاليين'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Marokko',
    type: 'Kaiser- & Königshaus',
    status: 'Regierend / Souverän',
    period: '1631 – heute',
    institution: 'Official Portal of Morocco / Royal Palace',
    seat: 'Royal Palace of Rabat',
    urls: {
      official: 'https://maroc.ma',
      encyclopedia: 'https://en.wikipedia.org/wiki/Alawi_dynasty'
    },
    crestMotif: "Grünes Wappen mit pentagrammstern, königliche Krone; Motto: 'Wenn ihr Allah unterstützt, unterstützt er euch.'",
    description: 'Sharifianische Dynastie, die ihre Abstammung auf den Propheten Muhammad zurückführt. König Mohammed VI. regiert seit 1999 als Amir al-Mu\'minin.',
    source: 'maroc.ma'
  },
  {
    name: 'Al Nahyan (Abu Dhabi / VAE)',
    altNames: ['House of Nahyan', 'آل نهيان', 'Al Nahyan Family'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Vereinigte Arabische Emirate',
    type: 'Fürsten- & Herzogshaus',
    status: 'Regierend / Souverän',
    period: '1761–heute',
    institution: 'Emirate of Abu Dhabi',
    seat: 'Al Mushrif Palace, Abu Dhabi',
    urls: {
      official: 'https://u.ae/en/about-the-uae/the-uae-government/government-leaders/h-h-sheikh-mohamed-bin-zayed-al-nahyan',
      encyclopedia: 'https://en.wikipedia.org/wiki/al_nahyan_family'
    },
    crestMotif: 'Wappen des Emirats Abu Dhabi mit Falken',
    description: 'Das Haus Al Nahyan ist die regierende Königsfamilie des Emirats Abu Dhabi und stellt den Präsidenten der VAE. Die Familie stammt vom Bani Yas-Stamm ab und regiert Abu Dhabi seit 1793.',
    source: 'u.ae'
  },
  {
    name: 'Al Maktoum (Dubai / VAE)',
    altNames: ['House of Maktoum', 'آل مكتوم', 'Al Maktoum Family'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Vereinigte Arabische Emirate',
    type: 'Fürsten- & Herzogshaus',
    status: 'Regierend / Souverän',
    period: '1833–heute',
    institution: 'Government of Dubai',
    seat: 'Zabeel Palace, Dubai',
    urls: {
      official: 'https://www.maktoum.ae/en',
      encyclopedia: 'https://en.wikipedia.org/wiki/Al_Maktoum'
    },
    crestMotif: 'Wappen Dubais mit Falken',
    description: 'Das Haus Al Maktoum ist die regierende Familie Dubais seit 1833 und stellt den Vizepräsidenten und Premierminister der VAE. Die Familie stammt vom Al Falasah-Zweig der Bani Yas ab.',
    source: 'maktoum.ae'
  },
  {
    name: 'Al Thani (Katar)',
    altNames: ['House of Thani', 'آل ثاني', 'Thani Dynasty'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Katar',
    type: 'Fürsten- & Herzogshaus',
    status: 'Regierend / Souverän',
    period: '1825–heute',
    institution: 'Amiri Diwan of the State of Qatar',
    seat: 'Amiri Diwan, Doha',
    urls: {
      official: 'https://www.diwan.gov.qa/en/',
      encyclopedia: 'https://en.wikipedia.org/wiki/House_of_Thani'
    },
    crestMotif: 'Wappen Katars mit zwei gekreuzten Schwertern und Dhow-Schiff',
    description: 'Das Haus Al Thani ist die regierende Familie Katars und stammt vom Banu Tamim-Stamm ab. Die Dynastie wurde von Thani bin Mohammed gegründet und regiert Katar als erbliche Monarchie.',
    source: 'diwan.gov.qa'
  },
  {
    name: 'Al Sabah (Kuwait)',
    altNames: ['House of Sabah', 'آل صباح', 'Al-Sabah Dynasty'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Kuwait',
    type: 'Fürsten- & Herzogshaus',
    status: 'Regierend / Souverän',
    period: '1752–heute',
    institution: 'Amiri Diwan of Kuwait',
    seat: 'Bayan Palace, Kuwait City',
    urls: {
      official: 'https://www.da.gov.kw/en/',
      encyclopedia: 'https://en.wikipedia.org/wiki/House_of_Al-Sabah'
    },
    crestMotif: 'Wappen Kuwaits mit Falken und Dhow-Schiff auf Wellen',
    description: 'Das Haus Al Sabah ist die regierende Familie Kuwaits und wurde von Sabah I. gegründet. Die Familie gehört zum Bani Utbah-Stamm und regiert Kuwait seit dem 18. Jahrhundert.',
    source: 'da.gov.kw'
  },
  {
    name: 'Al Khalifa (Bahrain)',
    altNames: ['House of Khalifa', 'آل خليفة', 'Al-Khalifa Dynasty'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Bahrain',
    type: 'Kaiser- & Königshaus',
    status: 'Regierend / Souverän',
    period: '1783–heute',
    institution: 'Royal Court of Bahrain',
    seat: 'Al Safriya Palace, Manama',
    urls: {
      official: 'https://www.mofa.gov.bh/en/his-majesty-the-king',
      encyclopedia: 'https://en.wikipedia.org/wiki/Al_Khalifa_dynasty'
    },
    crestMotif: 'Wappen Bahrains mit fünfzackigem Stern und rotem Schild',
    description: 'Das Haus Al Khalifa ist die regierende Königsfamilie Bahrains seit 1783. Die Familie stammt vom Bani Utbah-Stamm ab und eroberte Bahrain aus persischer Kontrolle.',
    source: 'mofa.gov.bh'
  },
  {
    name: 'Inka-Kaiserdynastie (Sapa Inka)',
    altNames: ['Inca Dynasty', 'House of Manco Cápac', 'Inca Imperial Dynasty', 'Tawantinsuyu Dynasty'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Peru',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: 'ca. 1200–1572 (Inka-Reich / Tawantinsuyu)',
    institution: 'Museo de Sitio Machu Picchu / Ministerio de Cultura del Perú',
    seat: 'Cusco, Peru / Machu Picchu (UNESCO-Welterbe)',
    urls: {
      official: 'https://www.cultura.gob.pe',
      museum: 'https://www.machupicchu.gob.pe',
      encyclopedia: 'https://en.wikipedia.org/wiki/Sapa_Inca'
    },
    crestMotif: 'Inka-Königswappen mit Sonnenscheibe (Inti), goldener Maschpaysch (Königsband) und Stab der Macht.',
    description: 'Die Inka-Kaiserdynastie, begründet durch Manco Cápac, herrschte über Tawantinsuyu, das größte vorkolumbianische Reich Amerikas. Pachacuti errichtete Machu Picchu; Atahualpa wurde 1533 von den Spaniern hingerichtet.',
    source: 'cultura.gob.pe'
  },
  {
    name: 'Aztekische Kaiserdynastie (Tenochtitlan)',
    altNames: ['Aztec Imperial Dynasty', 'House of Moctezuma', 'Mexica Dynasty', 'Huey Tlatoani'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Mexiko',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: 'ca. 1325–1521 (Aztekenreich)',
    institution: 'Museo del Templo Mayor / INAH',
    seat: 'Tenochtitlan (heute Mexiko-Stadt) / Templo Mayor',
    urls: {
      official: 'https://www.temploomayor.inah.gob.mx',
      museum: 'https://www.temploomayor.inah.gob.mx',
      encyclopedia: 'https://en.wikipedia.org/wiki/Moctezuma_II'
    },
    crestMotif: 'Adler auf Nopal-Kaktus mit Schlange (aztekisches Gründungssymbol); später spanisches Wappen für Nachfahren.',
    description: 'Die aztekische Kaiserdynastie von Tenochtitlan, begründet durch Acamapichtli (1376), herrschte über das Aztekenreich bis zur spanischen Eroberung 1521. Moctezuma II. war der letzte regierende Huey Tlatoani.',
    source: 'temploomayor.inah.gob.mx'
  },
  {
    name: 'Maya-Dynastie von Palenque (B\'aakal)',
    altNames: ['Maya Dynasty of Palenque', 'House of Pakal', 'Dynasty of Palenque', "B'aakal Dynasty"],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Mexiko',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: 'ca. 431–799 (Klassische Maya-Periode)',
    institution: 'INAH / Palenque Archaeological Site',
    seat: 'Palenque, Chiapas (UNESCO-Welterbe)',
    urls: {
      official: 'https://www.inah.gob.mx',
      museum: 'https://en.wikipedia.org/wiki/Palenque',
      encyclopedia: 'https://en.wikipedia.org/wiki/Pakal_the_Great'
    },
    crestMotif: 'Maya-Königswappen mit Quetzal-Federn, Jade-Maske und Glyphe des Ajaw (Königs).',
    description: "Die Maya-Dynastie von Palenque (B'aakal), berühmt durch K'inich Janaab' Pakal I. (Pakal der Große), der über 68 Jahre regierte und im Tempel der Inschriften begraben wurde.",
    source: 'inah.gob.mx'
  },
  {
    name: 'Maya-Dynastie von Tikal (Mutul)',
    altNames: ['Maya Dynasty of Tikal', 'House of Tikal', 'Mutul Dynasty'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Guatemala',
    type: 'Kaiser- & Königshaus',
    status: 'Ehem. Regierend / Souverän',
    period: 'ca. 200–900 (Klassische Maya-Periode)',
    institution: 'Tikal National Park (UNESCO-Welterbe) / IDAEH',
    seat: 'Tikal, Petén, Guatemala (UNESCO-Welterbe)',
    urls: {
      official: 'https://en.wikipedia.org/wiki/Tikal',
      encyclopedia: 'https://en.wikipedia.org/wiki/Tikal'
    },
    crestMotif: 'Tikal-Königswappen mit Jaguar, Quetzal-Federn und Tikal-Glyphe.',
    description: 'Eine der mächtigsten Maya-Dynastien der klassischen Periode, begründet durch Yax Ehb Xook. Tikal dominierte das zentrale Tiefland der Maya.',
    source: 'tikal.org'
  },
  {
    name: 'Washington Family',
    altNames: ['House of Washington', 'Washingtons of Virginia'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'USA',
    type: 'Hochadel & Grafenhaus',
    status: 'Historischer Adel',
    period: '17. Jh. – heute',
    institution: "Mount Vernon Ladies' Association",
    seat: 'Mount Vernon, Virginia / Sulgrave Manor (England)',
    urls: {
      official: 'https://www.mountvernon.org',
      foundation: 'https://www.mountvernon.org/preserve',
      museum: 'https://www.mountvernon.org',
      encyclopedia: 'https://en.wikipedia.org/wiki/Washington_family'
    },
    crestMotif: 'Weißer Streifen mit drei roten Sternen über zwei roten Streifen (Washington family coat of arms).',
    description: 'Eine der ältesten und bedeutendsten amerikanischen Familien, begründet von John Washington, der 1657 nach Virginia einwanderte. Ihr berühmtestes Mitglied war George Washington.',
    source: 'mountvernon.org'
  },
  {
    name: 'Roosevelt Family',
    altNames: ['House of Roosevelt', 'Roosevelts of New York', 'Roosevelt Dynasty'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'USA',
    type: 'Hochadel & Grafenhaus',
    status: 'Historischer Adel',
    period: '17. Jh. – heute',
    institution: 'Roosevelt Institute / Sagamore Hill National Historic Site',
    seat: 'Sagamore Hill (Oyster Bay, NY) / Hyde Park, NY',
    urls: {
      official: 'https://www.rooseveltinstitute.org',
      foundation: 'https://www.rooseveltinstitute.org',
      museum: 'https://www.nps.gov/sahi/index.htm',
      encyclopedia: 'https://en.wikipedia.org/wiki/Roosevelt_family'
    },
    crestMotif: "Rosen auf grünem Hügel; Familienmotto 'Qui plantavit curabit' (Wer gepflanzt hat, wird sorgen).",
    description: 'Niederländisch-amerikanische Politiker- und Geschäftsdynastie, die zwei US-Präsidenten hervorbrachte: Theodore Roosevelt und Franklin D. Roosevelt.',
    source: 'rooseveltinstitute.org'
  },
  {
    name: 'Rockefeller Family',
    altNames: ['House of Rockefeller', 'Rockefeller Dynasty'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'USA',
    type: 'Bankiers- & Handelsdynastie',
    status: 'Historischer Adel',
    period: '19. Jh. – heute',
    institution: 'Rockefeller Foundation / Rockefeller University',
    seat: 'Kykuit (Pocantico Hills, NY) / Forest Hill (Cleveland, OH)',
    urls: {
      official: 'https://www.rockefellerfoundation.org',
      foundation: 'https://www.rockefellerfoundation.org',
      museum: 'https://www.rockefellerfoundation.org',
      encyclopedia: 'https://en.wikipedia.org/wiki/Rockefeller_family'
    },
    crestMotif: "Felsen (Rock) und Brunnen (Feller) als Wappenmotiv; Familienmotto 'Sapientia et Doctrina'.",
    description: 'Eine der mächtigsten amerikanischen Familien, begründet durch John D. Rockefeller Sr., der Standard Oil gründete und als reichster Amerikaner seiner Zeit galt.',
    source: 'rockefellerfoundation.org'
  },
  {
    name: 'Kennedy Family',
    altNames: ['House of Kennedy', 'Kennedy Dynasty', 'Kennedys of Massachusetts'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'USA',
    type: 'Hochadel & Grafenhaus',
    status: 'Historischer Adel',
    period: '19. Jh. – heute',
    institution: 'John F. Kennedy Presidential Library and Museum',
    seat: 'Kennedy Compound (Hyannis Port, MA) / Hickory Hill (Virginia)',
    urls: {
      official: 'https://www.jfklibrary.org',
      foundation: 'https://www.jfklibrary.org',
      museum: 'https://www.jfklibrary.org',
      encyclopedia: 'https://en.wikipedia.org/wiki/Kennedy_family'
    },
    crestMotif: "Kennedy-Wappen mit drei Helmen und rot-goldenen Streifen; Familienmotto 'Invictus' (Unbesiegt).",
    description: "Irisch-amerikanische Politikerdynastie, begründet durch P.J. Kennedy. Die Familie brachte Präsident John F. Kennedy, Senatoren und Diplomaten hervor.",
    source: 'jfklibrary.org'
  },
  {
    name: 'Bolívar Family',
    altNames: ['Casa de Bolívar', 'Bolívar Dynasty', 'Bolívars of Caracas'],
    region: 'Weltweit (Asien, Afrika, Amerika, Naher Osten)',
    country: 'Venezuela',
    type: 'Hochadel & Grafenhaus',
    status: 'Historischer Adel',
    period: '16. Jh. – heute',
    institution: 'Casa Natal de Bolívar / Fundación Museos Nacionales Venezuela',
    seat: 'Caracas, Venezuela / San Mateo (Ingenio Bolívar)',
    urls: {
      official: 'https://www.museos.gob.ve',
      museum: 'https://en.wikipedia.org/wiki/Casa_Natal_de_Bol%C3%ADvar',
      encyclopedia: 'https://en.wikipedia.org/wiki/Sim%C3%B3n_Bol%C3%ADvar'
    },
    crestMotif: 'Bolívar-Wappen mit goldenem Stern auf blauem Schild und baskischen Ursprungssymbolen.',
    description: "Venezolanische Kreolen-Aristokratenfamilie baskischen Ursprungs. Simón Bolívar, 'El Libertador', führte die Unabhängigkeit Südamerikas an.",
    source: 'museos.gob.ve'
  }
];

// Write houses-global.ts
const globalOutput = `import { House } from '../types';

export const housesGlobal: House[] = ${JSON.stringify(globalHousesRaw.map(h => ({
  id: slugify(h.name),
  ...h,
  verifiedAt: '2024-2026'
})), null, 2)};
`;

fs.writeFileSync('./src/data/houses-global.ts', globalOutput, 'utf8');
console.log('Successfully created houses-global.ts with ' + globalHousesRaw.length + ' houses');
