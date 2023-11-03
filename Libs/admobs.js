import { Platform } from 'react-native';
import { AdsConsent, AdsConsentStatus, InterstitialAd, BannerAd,BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const requestOptions = {
  keywords: ['health', 'berth','home',"family","text","fonts"],
}

function is_test_ads(){
    return Platform.OS == "ios" || __DEV__;
}
function is_android(){
  return Platform.OS == "android";
}
async function Admob_init(){
  
  if(!is_android()){
    return ;
  }
  let _status = 0;
  const consentInfo = await AdsConsent.requestInfoUpdate();
  //alert("consentInfo.status:"+consentInfo.status);
  if(consentInfo.status==AdsConsentStatus.REQUIRED){
    const { status } = await AdsConsent.loadAndShowConsentFormIfRequired();
    _status = status;
    //alert("consentInfo.status:"+status);
  }
  return _status;

}
function Interstitial_load(){
  if(!is_android()){
    return ;
  }

  try {
      const adUnitId = is_test_ads() ? TestIds.INTERSTITIAL : global.adUnitId_inters;    
      const interstitial = InterstitialAd.createForAdRequest(adUnitId, requestOptions);
      interstitial.load();
      return interstitial;

  } catch (error) {
    return ;
  }

    
}

function BannerAd2(){
  if(!is_android()){
    return null;
  }
  try {  
      const adUnitId = is_test_ads() ? TestIds.BANNER       : global.adUnitId_banner;
      //console.log(adUnitId);
      //BannerAdSize.ANCHORED_ADAPTIVE_BANNER
      return (
          <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.INLINE_ADAPTIVE_BANNER }
            requestOptions={requestOptions}
          />
        );
  } catch (error) {
    return ;
  }

}


export {Interstitial_load, Admob_init, BannerAd2};