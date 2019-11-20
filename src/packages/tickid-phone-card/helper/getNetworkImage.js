import viettelImage from '../assets/images/viettel.png';
import mobifoneImage from '../assets/images/mobifone.png';
import vinaphoneImage from '../assets/images/vinaphone.png';
import vietnamobileImage from '../assets/images/vietnamobile.png';
import gmobileImage from '../assets/images/gmobile.png';

export default function getNetworkImage(type) {
  switch (type) {
    case 'phone_card_viettel':
    case 'phone_prepaid_viettel':
    case 'phone_postpaid_viettel':
      return viettelImage;
    case 'phone_card_mobifone':
    case 'phone_prepaid_mobifone':
    case 'phone_postpaid_mobifone':
      return mobifoneImage;
    case 'phone_card_vinaphone':
    case 'phone_prepaid_vinaphone':
    case 'phone_postpaid_vinaphone':
      return vinaphoneImage;
    case 'phone_card_vietnamobile':
    case 'phone_prepaid_vietnamobile':
    case 'phone_postpaid_vietnamobile':
      return vietnamobileImage;
    case 'phone_card_gtel':
    case 'phone_prepaid_gtel':
    case 'phone_postpaid_gtel':
      return gmobileImage;
  }
}
