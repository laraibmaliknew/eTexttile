import {StyleSheet} from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginBottom: 5,
      },
      inner: {
        // borderColor: '#ADD8E6',
        // borderWidth: 1
      },
      likeButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DA2D38',
        borderWidth: 0.5,
        borderColor: '#fff',
        height: 40,
        borderRadius: 5,
        margin: 5,
      },
      ImageIconStyle: {
        padding: 10,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
      },
      description: {
        marginLeft: 15,
      },

      main: {
        flex: 1,
        padding: 30,
        flexDirection: 'column',
        backgroundColor: '#fff'
      },
      mainContact: {
        flex: 1,
        padding: 5,
        flexDirection: 'column',
        backgroundColor: '#fff'
      },
      title: {
        marginBottom: 10,
        fontSize: 15,
        textAlign: 'center',
        color: 'black'
      },
      itemInputPost: {
        height: 80,
        padding: 4,
        marginRight: 5,
        fontSize: 15,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        color: 'black'
      },
      itemInput: {
        height: 30,
        padding: 4,
        marginRight: 5,
        fontSize: 15,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        color: 'black',
        marginBottom: 10
      },
      buttonText: {
        fontSize: 15,
        // color: '#DA2D38',
        color: 'white',
        alignSelf: 'center'
      },
      button: {
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#DA2D38',
        borderColor: '#DA2D38',
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
      },
      safeGif:{
        width:"100%",
        height:"100%",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:'white',
      },
      gifV:{
        width:200,
        height:200,
        // marginLeft:100,
      },
      Gif:{
        flex:1,
    },
    modalImage: {
    bottom: 0,
    marginBottom: 0,
    paddingBottom: 0,
    backgroundColor: '#000000',
  },
  containerTable: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  tableHead: { height: 40, backgroundColor: '#DA2D38' },
  tableTextHead:{ margin: 6, fontWeight: 'bold'},
  tableText: { margin: 6 },
  tableRow: { flexDirection: 'row' },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 10
  },
  contactText:{
    fontSize: 15, 
    marginTop: 20, 
    marginBottom: 15, 
    fontWeight: 'bold'
  }
});