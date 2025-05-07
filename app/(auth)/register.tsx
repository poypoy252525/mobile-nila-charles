import { baseURL } from "@/api";
import MedicalConditionButton from "@/components/MedicalConditionButton";
import UploadCredentialButton from "@/components/UploadCredentialButton";
import { RegisterForm } from "@/schemas/registerSchema";
import { useExpoPushToken } from "@/stores/useExpoPushToken";
import { useUserStore } from "@/stores/userStore";
import { supabase } from "@/utils/supabase";
import axios, { AxiosError } from "axios";
import { decode } from "base64-arraybuffer";
import { DocumentPickerAsset } from "expo-document-picker";
import { readAsStringAsync } from "expo-file-system";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Control, Path, useController, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { Button, Text, TextInput, TextInputProps } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { Dropdown } from "react-native-paper-dropdown";

const sex = [
  {
    label: "Male",
    value: "MALE",
  },
  {
    label: "Female",
    value: "FEMALE",
  },
];

const register = () => {
  const [gender, setGender] = useState<"MALE" | "FEMALE">();
  const [inputDate, setInputDate] = React.useState<Date>();
  const [files, setFiles] = useState<ImagePickerAsset[]>();
  const { handleSubmit, setValue, control } = useForm<RegisterForm>();
  const setStudent = useUserStore((state) => state.setStudent);
  const [pwdIdImage, setPwdIdImage] = useState<ImagePickerAsset>();
  const [loading, setLoading] = useState(false);
  const pushToken = useExpoPushToken((state) => state.token);

  useEffect(() => {
    if (gender) setValue("sex", gender);
    if (inputDate) setValue("birthdate", inputDate.toISOString());
  }, [gender, inputDate]);

  const onSubmit = async (form: RegisterForm) => {
    try {
      setLoading(true);
      const { data: signUpResult, error: signUpError } =
        await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });

      if (signUpError) {
        alert("Error signing up: " + signUpError.message);
      }

      console.log(signUpResult);

      const file = files ? files[0] : null;
      if (!file) {
        alert("Fill all input with valid data");
        return;
      }

      const base64 = await readAsStringAsync(file.uri, { encoding: "base64" });
      const path = `files/${file.fileName}`;

      const { data: image, error } = await supabase.storage
        .from("uploads")
        .upload(path, decode(base64), { upsert: true });

      let dataPwd, errorPwd;

      if (pwdIdImage) {
        const base64Pwd = await readAsStringAsync(pwdIdImage?.uri || "", {
          encoding: "base64",
        });
        const pathPwd = `files/${pwdIdImage?.fileName}`;

        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(pathPwd, decode(base64Pwd), { upsert: true });

        dataPwd = data;
        errorPwd = error;
      }

      if (error) {
        alert("Failed to upload file/image");
        return;
      }

      if (errorPwd) {
        alert("Failed to upload pwd ID");
        return;
      }

      const {
        data: { publicUrl },
      } = await supabase.storage.from("uploads").getPublicUrl(image.path);

      let pwdPublicUrl;

      if (dataPwd?.path) {
        const {
          data: { publicUrl },
        } = await supabase.storage.from("uploads").getPublicUrl(dataPwd?.path);
        pwdPublicUrl = publicUrl;
      }

      const { data } = await axios.post(`${baseURL}/api/students`, {
        ...form,
        pushToken,
        credentials: [
          {
            fileName: file.fileName,
            size: file.fileSize,
            mimeType: file.mimeType,
            url: publicUrl,
            type: "REPORT_CARD",
          },
          pwdIdImage && {
            fileName: pwdIdImage?.fileName,
            size: pwdIdImage?.fileSize,
            mimeType: pwdIdImage?.mimeType,
            url: pwdPublicUrl,
            type: "HEALTH_CONDITION",
          },
        ].filter((el) => el !== null),
      });

      setStudent({
        email: data.email,
        status: data.status,
        studentId: data.studentId,
      });
      alert("Please wait for the verification.");
      router.replace(`/login`);
    } catch (error) {
      console.error("error: ", error);
      if (error instanceof AxiosError) {
        alert("Fill all input with valid data");
      }
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 24, flex: 1, rowGap: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: "semibold" }}>Register</Text>
          <Input control={control} mode="outlined" label="Email" name="email" />
          <Input
            control={control}
            mode="outlined"
            label="Password"
            name="password"
            textContentType="password"
            secureTextEntry
          />
          <Input
            control={control}
            mode="outlined"
            label="First name"
            name="firstName"
          />
          <Input
            control={control}
            mode="outlined"
            label="Middle name"
            name="middleName"
          />
          <Input
            control={control}
            mode="outlined"
            label="Last name"
            name="lastName"
          />
          <Dropdown
            mode="outlined"
            options={sex}
            label="Sex"
            value={gender}
            onSelect={(value) => setGender(value as "MALE" | "FEMALE")}
          />
          {/* <View style={{ paddingVertical: 26 }}> */}
          <DatePickerInput
            locale="en"
            mode="outlined"
            label="Birthdate"
            value={inputDate}
            onChange={(d) => setInputDate(d)}
            inputMode="start"
          />
          {/* </View> */}
          <Input
            control={control}
            name="phone"
            mode="outlined"
            label="Phone"
            keyboardType="number-pad"
          />
          <Input
            control={control}
            name="address"
            mode="outlined"
            label="Address"
          />
          <MedicalConditionButton
            onSelectImage={(images) => setPwdIdImage(images[0])}
          />
          <UploadCredentialButton onSelectFile={(files) => setFiles(files)} />
          <Button
            mode="contained"
            disabled={loading}
            onPress={handleSubmit(onSubmit)}
          >
            Register
          </Button>
          <Button onPress={() => router.replace(`/login`)}>Login</Button>
        </View>
      </ScrollView>
    </View>
  );
};

interface Props extends TextInputProps {
  control: Control<RegisterForm>;
  name: Path<RegisterForm>;
}

const Input = ({ control, name, ...props }: Props) => {
  const { field } = useController({
    control,
    name,
  });

  return (
    <TextInput {...props} value={field.value} onChangeText={field.onChange} />
  );
};

export default register;
