import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  ProgressBarAndroid,
  ToastAndroid,
  PermissionsAndroid
} from "react-native";
import RNFetchBlob from "rn-fetch-blob";

export default class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      loading: false
    };
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
      path: dirs.DownloadDir + "/path-to-file.png",
      fileCache: true
    })
      .fetch(
        "GET",
        "https://cdn.pixabay.com/photo/2015/12/01/20/28/fall-1072821__340.jpg",
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
          "Your file has been downloaded to downloads folder!",
          ToastAndroid.SHORT,
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
      <View>
        <Text> Download Files in Android </Text>
        <Button onPress={() => this.downloadFile()} title="Download" />
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
