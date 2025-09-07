import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all translation files
import en from './locales/en.json';
import es from './locales/es.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import ru from './locales/ru.json';
import ro from './locales/ro.json';
import ar from './locales/ar.json';
import ta from './locales/ta.json';
import fi from './locales/fi.json';
import pt from './locales/pt.json';
import nl from './locales/nl.json';
import sv from './locales/sv.json';
import no from './locales/no.json';
import da from './locales/da.json';
import pl from './locales/pl.json';
import cs from './locales/cs.json';
import sk from './locales/sk.json';
import hu from './locales/hu.json';
import hr from './locales/hr.json';
import sr from './locales/sr.json';
import sl from './locales/sl.json';
import mk from './locales/mk.json';
import el from './locales/el.json';
import tr from './locales/tr.json';
import et from './locales/et.json';
import lv from './locales/lv.json';
import lt from './locales/lt.json';
import is from './locales/is.json';
import gl from './locales/gl.json';
import ca from './locales/ca.json';
import oc from './locales/oc.json';
import vi from './locales/vi.json';
import ms from './locales/ms.json';
import id from './locales/id.json';
import tl from './locales/tl.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import te from './locales/te.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';
import gu from './locales/gu.json';
import pa from './locales/pa.json';
import or from './locales/or.json';
import ne from './locales/ne.json';
import bo from './locales/bo.json';
import uk from './locales/uk.json';
import sw from './locales/sw.json';
import zu from './locales/zu.json';
import xh from './locales/xh.json';
import st from './locales/st.json';
import tn from './locales/tn.json';
import nso from './locales/nso.json';
import sn from './locales/sn.json';
import rn from './locales/rn.json';
import rw from './locales/rw.json';
import lg from './locales/lg.json';
import ki from './locales/ki.json';
import yo from './locales/yo.json';
import ig from './locales/ig.json';
import ha from './locales/ha.json';
import mg from './locales/mg.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  de: { translation: de },
  fr: { translation: fr },
  it: { translation: it },
  ru: { translation: ru },
  ro: { translation: ro },
  ar: { translation: ar },
  ta: { translation: ta },
  fi: { translation: fi },
  pt: { translation: pt },
  nl: { translation: nl },
  sv: { translation: sv },
  no: { translation: no },
  da: { translation: da },
  pl: { translation: pl },
  cs: { translation: cs },
  sk: { translation: sk },
  hu: { translation: hu },
  hr: { translation: hr },
  sr: { translation: sr },
  sl: { translation: sl },
  mk: { translation: mk },
  el: { translation: el },
  tr: { translation: tr },
  et: { translation: et },
  lv: { translation: lv },
  lt: { translation: lt },
  is: { translation: is },
  gl: { translation: gl },
  ca: { translation: ca },
  oc: { translation: oc },
  vi: { translation: vi },
  ms: { translation: ms },
  id: { translation: id },
  tl: { translation: tl },
  hi: { translation: hi },
  bn: { translation: bn },
  te: { translation: te },
  kn: { translation: kn },
  ml: { translation: ml },
  gu: { translation: gu },
  pa: { translation: pa },
  or: { translation: or },
  ne: { translation: ne },
  bo: { translation: bo },
  uk: { translation: uk },
  sw: { translation: sw },
  zu: { translation: zu },
  xh: { translation: xh },
  st: { translation: st },
  tn: { translation: tn },
  nso: { translation: nso },
  sn: { translation: sn },
  rn: { translation: rn },
  rw: { translation: rw },
  lg: { translation: lg },
  ki: { translation: ki },
  yo: { translation: yo },
  ig: { translation: ig },
  ha: { translation: ha },
  mg: { translation: mg }
};

i18n
  // Pass the i18n instance to react-i18next (no language detection)
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en', // Default to English, user must explicitly change
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // No automatic language detection - purely user controlled
    react: {
      useSuspense: false,
    }
  });

export default i18n;
