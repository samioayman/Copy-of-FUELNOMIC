import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

export const useRegister = (navigation) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isCitizen, setIsCitizen] = useState(true);
  const [myKad, setMyKad] = useState('');
  const [loading, setLoading] = useState(false);
 //new state for OCR
  const [scanning, setScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  
  const validateEmail = (text) => {
    setEmail(text); 

    if (text.length === 0) {
      setEmailError('');
      return;
    }
    // Standard Email Regex Pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailPattern.test(text)) {
      setEmailError('Please enter a valid email address(e.g user@email.com)');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (text) => {
    setPassword(text); 
    if (text.length === 0) {
      setPasswordError('');
      return;
    }
    if (text.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }
    const hasUpperCase = /[A-Z]/.test(text);
    const hasNumber = /[0-9]/.test(text);

    if (!hasUpperCase || !hasNumber) {
      setPasswordError('Password must contain at least 1 Uppercase letter and 1 Number.');
      return;
    }
    setPasswordError('');
  };

  const determineEligibility = (residency, myKadNumber) => {
    if (!residency) return 'non_eligible';
    const lastDigit = parseInt(myKadNumber.slice(-1));
    return lastDigit % 2 === 0 ? 'eligible' : 'non_eligible';
  };

  const scanMyKad = async () => {
    // 1. Ask for Camera Permissions
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow camera access to scan MyKad.");
      return;
    }

    // 2. Open Camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Let them crop to the ID card
      aspect: [4, 3],
      quality: 0.5, // Lower quality is faster for OCR
      base64: true, // We need the text data of the image
    });

    if (!result.canceled) {
      setScanning(true);
      setCapturedImage(result.assets[0]);
      try {
        // 3. CALL OCR API (The "Brain")
        // Note: For FYP, you can use a free API key from ocr.space
        const detectedText = await performOCR(result.assets[0].base64);
        
        // 4. Extract MyKad Number using Regex
        // Pattern: 6 digits - 2 digits - 4 digits (e.g., 990101-14-1234)
        const myKadPattern = /\d{6}-\d{2}-\d{4}/; 
        const match = detectedText.match(myKadPattern);

        if (match) {
          setMyKad(match[0]); // Auto-fill the input!
          Alert.alert("Scanned!", `Found MyKad: ${match[0]}`);
        } else {
          Alert.alert("Try Again", "Could not clearly read the MyKad number. Please type it in manually.");
        }
      } catch (error) {
        // Even if OCR fails, we have the image for manual upload!
        Alert.alert("OCR Failed", "Please type details manually, but we kept the photo for verification.");
      }
      setScanning(false);
    }
  };

  // ☁️ NEW: Helper to Upload Image to Supabase
  const uploadProof = async (userId, imageFile) => {
    if (!imageFile) return null;

    const fileExt = imageFile.uri.split('.').pop();
    const fileName = `${userId}-ic.${fileExt}`;
    const filePath = `${fileName}`;

    // Read file as Base64 (Expo specific)
    const base64 = imageFile.base64; 
    
    // Upload to 'ic_scans' bucket
    const { data, error } = await supabase.storage
      .from('ic_scans')
      .upload(filePath, decode(base64), {
        contentType: 'image/jpeg'
      });

    if (error) {
      console.log('Upload Error:', error);
      return null;
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('ic_scans')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  // 🧠 Helper: The Real OCR API Call
  const performOCR = async (base64Image) => {
    // OPTION A: Free OCR.space API (Register for free key at ocr.space)
    // OPTION B: Google Cloud Vision (More accurate, but requires setup)
    
    const apiKey = 'K82000441188957'; // Get a free key: https://ocr.space/ocrapi
    const formData = new FormData();
    formData.append("base64Image", "data:image/jpeg;base64," + base64Image);
    formData.append("language", "eng");
    formData.append("isOverlayRequired", "false");

    try {
      // 3. Send to the Internet
      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: { 
          'apikey': apiKey 
          // Do NOT set 'Content-Type': 'multipart/form-data' here; 
          // React Native sets it automatically with the boundary.
        },
        body: formData
      });

      const data = await response.json();

      // 4. Extract the text result
      // OCR.space returns an array of "ParsedResults". We want the first one.
      if (data.ParsedResults && data.ParsedResults.length > 0) {
        return data.ParsedResults[0].ParsedText;
      } else {
        return "";
      }
    } catch (error) {
      console.error("OCR API Failed:", error);
      throw error;
    }

    // // FOR NOW: Mock Response to prove the flow works without an API Key
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve("IDENTITY CARD \n NAME: ALI BIN ABU \n IC: 990101-14-5002 \n ADDRESS: KL");
    //   }, 2000);
    // });
  };

  const handleSignUp = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('Error', 'Please fill in all basic fields.');
      return;
    }

    if (passwordError) {
      Alert.alert('Weak Password', passwordError);
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Password cannot be empty.');
      return;
    }

    if (emailError || passwordError) {
      Alert.alert('Validation Error', 'Please fix the errors in red before continuing.');
      return;
    }
    
    if (!email || !password || !fullName) {
      Alert.alert('Error', 'Please fill in all basic fields.');
      return;
    }

    if (!capturedImage) {
      Alert.alert("Photo Required", "You must take a photo of your MyKad for verification, even if you type manually.");
      return;
    }
    setLoading(true);

    // 1. Calculate Logic FIRST
    const calculatedStatus = determineEligibility(isCitizen, myKad);
    // const { error: profileError } = await supabase.from('profiles').insert([...]);

    const timestamp = Date.now();
    // Use a modified uploadProof that takes a string instead of userId
    // OR just pass `${timestamp}` as the first arg to your existing uploadProof
    const photoUrl = await uploadProof(`${timestamp}`, capturedImage); 

    if (!photoUrl) {
        Alert.alert("Upload Failed", "Could not upload photo.");
        setLoading(false);
        return;
    }

    // 2. Sign up and pass data as "Meta Data"
    const { data: { session, user }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { // This data is sent to the SQL Trigger we just wrote
          full_name: fullName,
          residency_status: isCitizen ? 'citizen' : 'non_citizen',
          mykad_number: isCitizen ? myKad : null,
          eligibility_status: calculatedStatus,
          verification_status: 'pending',
          ic_photo_url: photoUrl
        },
      },
    });

  //   if (profileError) {
  //   // PostgreSQL Error Code 23505 means "Unique Violation"
  //   if (profileError.code === '23505' || profileError.message.includes('unique')) {
  //     Alert.alert('Registration Failed', 'This MyKad number is already registered. Please log in instead.');
  //   } else {
  //     Alert.alert('System Error', profileError.message);
  //   }
  // }

    if (error) {
      Alert.alert('Registration Failed', error.message);
    } else {
      // 3. Handle the "Check Email" state
      if (!session && user) {
        Alert.alert(
          'Verification Required',
          'Please check your email to confirm your account before logging in.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        // If you turned off email verification, this runs
        Alert.alert('Success', 'Account created!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    }
    // if (user) {
    //   // 1. Upload the image now that we have a User ID
    //   const photoUrl = await uploadProof(user.id, capturedImage);

    //   if (photoUrl) {
    //     // 2. Update the profile with the photo URL
    //     await supabase
    //       .from('profiles')
    //       .update({ ic_photo_url: photoUrl })
    //       .eq('id', user.id);
    //   }

    //   Alert.alert(
    //     'Success!', 
    //     'Account created. Please check your email to verify.',
    //     [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
    //   );
    // }

    setLoading(false);
  };


  return {
    email, setEmail: validateEmail, emailError,
    password, setPassword: validatePassword, passwordError,
    fullName, setFullName,
    isCitizen, setIsCitizen,
    myKad, setMyKad,
    loading,
    handleSignUp,
    scanMyKad, 
    capturedImage,
    scanning,
    isPasswordVisible,    
    setIsPasswordVisible,
  };
};