import * as React from 'react';
import {  View, StyleSheet, ScrollView,TextInput,Pressable  , Text ,Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import Unicode from "./Libs/unicode_lib";
let BannerAd = ()=>{return null};
if (!__DEV__){
    const {Admob_init,BannerAd2,Interstitial_load} = require('./Libs/admobs');
    //Admob_init will be activated when 'user consent" is required
    //Admob_init();
    BannerAd = BannerAd2;
    let interstitial = Interstitial_load();
    setInterval(()=>{
        try {
            interstitial.show();
            interstitial = Interstitial_load();
        } catch (error) {console.log(error);}
    }, 60000);
}
if(Platform.OS !== "web"){
    document = {};
}
function is_test_ads(){
    return true;
    return Platform.OS == "ios" || __DEV__;
}
global.adUnitId_inters = 'ca-app-pub-5231842333475288/3689183557';
global.adUnitId_banner = 'ca-app-pub-5231842333475288/9635977941';

//Admob_init();

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        text : "Hello world!",
        styled_text : [],
        page:1,
        page_size:8,
        current_theme:"light",
    };
  }
  unicode=(text)=>{
    let result = "";
    try {
        result = Unicode(text.trim());
    } catch (error) {
        
        console.log(error);
        console.log("Unicode",Unicode)
        //console.log("abc",abc);
    }
    return result;
  }
  componentDidMount(){
    this.injectWebCss();
    AsyncStorage.getItem('current_theme').then(current_theme=>{
        current_theme = current_theme ? current_theme : "light";
        styles = current_theme=="light" ? styles_light : styles_dark;
        this.setState({current_theme:current_theme});
        this.setState({styled_text : this.unicode(this.state.text)});
    });
  }
  copytoClipboard = async (text,style_name)=>{

    await Clipboard.setStringAsync(text);
    this.setState({is_copied:style_name});
    return true;
  }
  injectWebCss = f => {
	// Only on web
	if ( Platform.OS !== 'web'){return true;}
	// Inject style
	const style = document.createElement('style')
	style.textContent = `textarea, select, input, button { outline: none!important; }`
	return document.head.append(style)
    }

  render(){
    let page =1;
    let i=1;
    let showed_styles_count = 1;
    const styled_text = Object.keys(this.state.styled_text).map(style_name=>{
        const ispage = i<this.state.page_size*(this.state.page) && i>this.state.page_size*(this.state.page-1) ? true : false;
        i++;
        if(!ispage){
            return null;
        }
        showed_styles_count++;
        return (
            <Pressable style={styles.style_item_view} key={style_name} onPress={()=>this.copytoClipboard(this.state.styled_text[style_name],style_name)}>
                <View style={styles.style_info_v}>
                    <Text style={styles.style_info_name_text} >{style_name.charAt(0).toUpperCase() + style_name.slice(1)}</Text>
                    <Text style={styles.style_info_iscopied_text}>{this.state.is_copied==style_name?"Copied!":""}</Text>
                </View>
                <Text style={styles.style_item_text} selectable={true} selectionColor='orange'>{this.state.styled_text[style_name]}</Text>
            </Pressable>
            );
    });
    return(
      <View style={styles.container}>
        <View style={{flexDirection:"row",flexWrap:"wrap",width:"100%",justifyContent:"center",alignItems:"center",paddingHorizontal:10}}>
            <TextInput
                style={styles.textInput}
                placeholder={"Text to be styled unicode"}
                placeholderTextColor="#ecf0f1"
                onChangeText ={newValue=>{
                    this.setState({text:newValue.trim(),styled_text : this.unicode(newValue)});
                }}
                value={this.state.text}
                autoCorrect={false}
                autoCapitalize="none"
            />
            <Pressable style={styles.them_btn} onPress={()=>{
                AsyncStorage.setItem('current_theme',this.state.current_theme=="light"?"dark":"light").then(o=>{
                    styles = this.state.current_theme=="light" ? styles_dark : styles_light;
                    this.setState({current_theme:this.state.current_theme=="light"?"dark":"light"});
                });
            }}>
            </Pressable>
        </View>
        <ScrollView style={styles.results_view} contentContainerStyle={styles.results_view_container}>{styled_text}</ScrollView>
        
        <View style={styles.next_prev_view}>
            <Pressable style={styles.next_prev} onPress={()=>{
                if(this.state.page>1){
                    this.setState({page:this.state.page-1});
                }
                }}><Text style={{fontSize:30}}>{"◄"}</Text></Pressable>
            <Text>{this.state.page}</Text>
            <Pressable style={styles.next_prev} onPress={()=>{
                if(showed_styles_count>=this.state.page_size){
                    this.setState({page:this.state.page+1});
                }
                
                }}><Text style={{fontSize:30}}>{"►"}</Text></Pressable>
        </View>
        <View style={styles.ads_view}>
          <BannerAd />
        </View>
      </View>
      );
  }
}

const styles_light = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ecf0f1',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop:"10%",
    },
    them_btn:{
        height:30,
        width:30,
        borderRadius:15,
        backgroundColor:"#000",
        marginHorizontal:10,
        cursor:"pointer",
    },
    textInput: {
        //outlineWidth:0,
        borderWidth:0,
        flex:1,
        backgroundColor: '#ecf0f1',
        //width:250,
        backgroundColor:"#0001",
        padding:10,
        height:45,
        margin:5,
        borderTopLeftRadius:20,
        borderBottomRightRadius:50,
    },
    style_info_v:{
        flexDirection:"row",
        flexWrap:"wrap",
        width:"100%",
        height:15,
    },
    style_info_name_text:{
        flex:1,
        fontSize:10,
        color:"#9b59b6",
        
    },
    style_info_iscopied_text:{
        fontSize:13,
        width:50,
        color:"#2ecc71",
    },
    style_item_view:{
        height:70,
        width:"90%",
        borderWidth:1,
        borderRadius:10,
        margin:3,
        paddingHorizontal:5,
        backgroundColor:"#f5f6fa"
        //justifyContent:"center",
    },
    style_item_text:{
        //height:"100%",
        width:"100%",
        textAlign:"left",
        fontSize:20,
    },
    
    next_prev:{
        cursor:"pointer",
        padding:5,
        margin:5,
        height:40,
        width:40,
        borderRadius:20,
        backgroundColor:"#c5c7d9c7",
        justifyContent:"center",
        alignItems:"center"

    },
    next_prev_view:{
        flexDirection:"row",
        flexWrap:"wrap",
        marginBottom:20
    },
    results_view: {
        width:"100%",
        backgroundColor: '#ecf0f1',
        height:100
    },
    results_view_container: {
        width:"100%",
        flex:1,
        backgroundColor: '#ecf0f1',
        alignItems: 'center',
    },
    ads_view: {
        backgroundColor: '#ecf0f1',
        width:"98%",
        //flex:1,
        height:120,
        alignItems: 'center',
        bottom:0,
        marginVertical:10
    },
  });

  
  const styles_dark = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#34495e',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop:"10%",
    },
    them_btn:{
        height:30,
        width:30,
        borderRadius:15,
        backgroundColor:"#fff",
        marginHorizontal:10,
        cursor:"pointer",
    },
    textInput: {
        backgroundColor: '#7f8c8d',
        flex:1,
        //backgroundColor:"#0001",
        padding:10,
        height:45,
        margin:5,
        borderTopLeftRadius:20,
        borderBottomRightRadius:50,
    },
    style_info_v:{
        flexDirection:"row",
        flexWrap:"wrap",
        width:"100%",
        height:15,
    },
    style_info_name_text:{
        flex:1,
        fontSize:10,
        color:"#9b59b6"
    },
    style_info_iscopied_text:{
        fontSize:13,
        width:50,
        color:"#2ecc71"
    },
    style_item_view:{
        height:70,
        width:"90%",
        borderWidth:1,
        borderRadius:10,
        margin:3,
        paddingHorizontal:5,
        backgroundColor:"#273c75"
        //justifyContent:"center",
    },
    style_item_text:{
        //height:"100%",
        width:"100%",
        textAlign:"left",
        color:"#dcdde1",
        fontSize:20,
    },
    
    next_prev:{
        cursor:"pointer",
        padding:5,
        margin:5,
        height:40,
        width:40,
        borderRadius:20,
        backgroundColor:"#c5c7d9c7",
        justifyContent:"center",
        alignItems:"center"
    },
    next_prev_view:{
        flexDirection:"row",
        flexWrap:"wrap",
        marginBottom:20
    },
    results_view: {
        width:"100%",
        flex:1,
        backgroundColor: '#34495e',
    },
    results_view_container: {
        width:"100%",
        //flex:1,
        backgroundColor: '#34495e',
        alignItems: 'center',
    },
    ads_view: {
        backgroundColor: '#34495e',
        width:"98%",
        //flex:1,
        height:120,
        alignItems: 'center',
        bottom:0,
        marginVertical:10
    },
  });

global.styles=styles_light;
export default HomeScreen;