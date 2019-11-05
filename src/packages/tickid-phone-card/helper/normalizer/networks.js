import viettelImage from '../../assets/images/viettel.png';
import mobifoneImage from '../../assets/images/mobifone.png';
import vinaphoneImage from '../../assets/images/vinaphone.png';
import vietnamobileImage from '../../assets/images/vietnamobile.png';
import gmobileImage from '../../assets/images/gmobile.png';

function getImageByType(type) {
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

export function normalize(service) {
  return service.sub_services.map(network => {
    return {
      ...network,
      localImage: getImageByType(network.type)
    };
  });
}

export function denormalize(data) {}
