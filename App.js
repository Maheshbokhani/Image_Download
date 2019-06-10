import React, { Component } from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, ProgressBarAndroid,
  ToastAndroid,
  PermissionsAndroid, TextInput, View
} from 'react-native';
import RNFetchBlob from "rn-fetch-blob";

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      image_url: "",
      url: ""
    }
  }
  check_Button = async () => {
    this.setState({
      image_url: this.state.url
    })

  }
  actualDownload = () => {
    this.setState({
      progress: 0,
      loading: true
    });
    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      path: dirs.DownloadDir + "/Image_Download.png",
      fileCache: true
    })
      .fetch(
        "GET",
        this.state.image_url,
        {
          //some headers ..
        }
      )
      .progress((received, total) => {
        console.log("progress", received / total);
        this.setState({ progress: received / total });
      })
      .then(res => {
        this.setState({
          progress: 100,
          loading: false
        });
        ToastAndroid.showWithGravity(
          "Download Completed!",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      });
  };
  async downloadFile() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "App needs access to memory to download the file "
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.actualDownload();
      } else {
        Alert.alert(
          "Permission Denied!",
          "You need to give storage permission to download the file"
        );
      }
    } catch (err) {
      console.warn(err);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input_Text}
          onChangeText={(url) => this.setState({ url })}
          placeholder='Enter Url '
          value={this.state.url}
        />
        <TouchableOpacity style={styles.check_Button}>
          <Text
            style={styles.button_Text} onPress={this.check_Button}> Check </Text>
        </TouchableOpacity>

        <Image
          onPress={this.image}
          style={styles.imageset}
          source={{ uri: this.state.image_url }}
        />

        <Text>{this.state.image_url}</Text>

        <TouchableOpacity style={styles.download_Button}>
          <Text
            style={styles.button_Text} onPress={() => this.downloadFile()}>  Download  </Text>
        </TouchableOpacity>
        {this.state.loading ? (
          <ProgressBarAndroid
            styleAttr="Large"
            indeterminate={false}
            progress={this.state.progress}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
  input_Text: {
    marginTop: 20,
    width: 350,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'lightblue',
    borderWidth: 1,
    borderColor: 'blue'
  },
  check_Button: {
    marginTop: 10,
    width: 150,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'lightblue',
    borderColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_Text: {
    color: 'black',
    fontSize: 18
  },
  imageset: {
    width: 350,
    height: 250,
    marginTop: 20,
    backgroundColor: 'gray'
  },
  download_Button: {
    marginTop: 30,
    width: 250,
    borderRadius: 10,
    height: 50,
    borderWidth: 1,
    backgroundColor: 'lightblue',
    borderColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
