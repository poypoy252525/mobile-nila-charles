import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Button } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

const options = [
  {
    label: "Normal",
    value: "NORMAL",
  },
  {
    label: "PWD",
    value: "PWD",
  },
];

interface Props {
  onSelectImage: (images: ImagePicker.ImagePickerAsset[]) => void;
}

const MedicalConditionButton = ({ onSelectImage }: Props) => {
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>();
  const handleSubmit = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
        allowsMultipleSelection: false,
      });

      setImages(result.assets || []);
    } catch (error) {
      console.error(error);
    }
  };

  const [healthCondition, setHealthCondition] = useState<string>("NORMAL");

  useEffect(() => {
    if (healthCondition === "NORMAL") {
      setImages([]);
    }
  }, [healthCondition]);

  useEffect(() => {
    if (images) {
      onSelectImage(images);
    }
  }, [images]);

  return (
    <View>
      <Dropdown
        mode="outlined"
        options={options}
        label="Medical Condition"
        value={healthCondition}
        onSelect={(value) => value && setHealthCondition(value)}
      />
      {healthCondition === "PWD" && (
        <View>
          <Button
            style={{ paddingTop: 12 }}
            onPress={() => {
              handleSubmit();
            }}
          >
            PWD ID
          </Button>
          {images?.map((image) => (
            <Image
              source={image.uri}
              key={image.assetId}
              style={{ width: 100, height: 100 }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default MedicalConditionButton;
