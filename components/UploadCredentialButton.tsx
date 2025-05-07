import { Image } from "expo-image";
import { ImagePickerAsset, launchImageLibraryAsync } from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";

interface Props {
  onSelectFile: (files: ImagePickerAsset[]) => void;
}

const UploadCredentialButton = ({ onSelectFile }: Props) => {
  const [files, setFiles] = useState<ImagePickerAsset[]>();

  useEffect(() => {
    if (files) onSelectFile(files);
  }, [files]);

  const uploadFile = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: ["images"],
    });

    if (result.canceled) {
      return;
    }

    const { assets } = result;

    setFiles(assets);
    // const file = assets[0];

    // try {
    //   const base64 = await readAsStringAsync(file.uri, { encoding: "base64" });
    //   const path = `files/${new Date().getTime()}-${file.name}`;

    //   console.log(path);

    //   const { data, error } = await supabase.storage
    //     .from("uploads")
    //     .list("files");

    //   console.log(data);

    //   console.log("success");
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <View>
      <Button onPress={uploadFile} mode="outlined">
        Report card Image
      </Button>
      <View style={{ paddingTop: 12 }}>
        {files && (
          <Image source={files[0].uri} style={{ width: 100, height: 100 }} />
        )}
      </View>
    </View>
  );
};

export default UploadCredentialButton;
