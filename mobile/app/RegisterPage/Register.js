// mobile/app/screens/Register.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRegister } from '../RegisterPage/useRegister'; 
import { styles } from '../RegisterPage/Styles'; 
import { Ionicons } from '@expo/vector-icons';


export default function Register({ navigation }) {
  // Use the custom hook to get all data and functions
  const {
    email, setEmail, emailError,
    password, setPassword, passwordError,
    isPasswordVisible, setIsPasswordVisible,
    fullName, setFullName,
    isCitizen, setIsCitizen,
    myKad, setMyKad,
    loading,
    handleSignUp,
    scanMyKad,
    scanning,
    capturedImage
  } = useRegister(navigation);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fuelnomic Register</Text>

      {/* Basic Info */}
      <TextInput 
        placeholder="Full Name (Enter as per IC)" 
        value={fullName} 
        onChangeText={setFullName} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
        keyboardType="email-address"
        style={[
        styles.input,
        emailError && styles.inputError,
        ]}
 
      />
      {emailError ? (
          <Text style={styles.errorText}>⚠️ {emailError}</Text>
        ) : null}

      <View 
      style={[
        styles.inputWithIconContainer,
        passwordError && styles.inputContainerError,
    ]}>
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry={!isPasswordVisible} // Logic flips here
        style={styles.inputWithIcon}
      />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.iconButton}>
            <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      
      {passwordError ? (
          <Text style={styles.errorText}>⚠️ {passwordError}</Text>
        ) : null}

      {/* Residency Toggle */}
      <View style={styles.toggleContainer}>
        <Text style={styles.label}>Citizenship Status:</Text>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.btn, isCitizen && styles.btnActive]} 
            onPress={() => setIsCitizen(true)}>
            <Text style={[styles.btnText, isCitizen && styles.textActive]}>Malaysian 🇲🇾</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btn, !isCitizen && styles.btnActive]} 
            onPress={() => setIsCitizen(false)}>
            <Text style={[styles.btnText, !isCitizen && styles.textActive]}>Non-Citizen 🌍</Text>
          </TouchableOpacity>
        </View>
      </View>

    {/* Conditional MyKad Input Section */}
    {isCitizen && (
    <View style={styles.conditionalSection}>
        <Text style={styles.helperText}>MyKad Number:</Text>
        
        <View style={styles.inputWithIconContainer}>
        <TextInput 
            placeholder="e.g. 990101-14-1234" 
            value={myKad} 
            onChangeText={setMyKad} 
            keyboardType="numeric"
            maxLength={14}
            style={styles.inputWithIcon} // New style
        />
        </View>
        {/* OR Divider */}
        <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
        </View>
        
        {/* The OCR Button */}
        <TouchableOpacity 
            onPress={scanMyKad} 
            style={[styles.scanButton, capturedImage && styles.scanButtonSuccess]} 
            >
            <Ionicons 
                name={capturedImage ? "checkmark-circle" : "camera-outline"} 
                size={20} 
                color={capturedImage ? "white" : "#007AFF"} 
            />
            <Text style={[styles.scanButtonText, capturedImage && {color: 'white'}]}>
                {capturedImage ? "MyKad Photo Attached" : "Scan MyKad (Required)"}
            </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity 
            onPress={scanMyKad} 
            style={styles.scanButton} 
            disabled={scanning}
            >
            {scanning ? (
                <Text style={styles.scanButtonText}>Scanning...</Text>
            ) : (
                <>
                <Ionicons name="camera-outline" size={20} color="#007AFF" style={{marginRight: 8}} />
                <Text style={styles.scanButtonText}>Scan MyKad with Camera</Text>
                </>
            )}
        </TouchableOpacity> */}
        {/* <TouchableOpacity onPress={scanMyKad} style={styles.iconButton} disabled={scanning}>
            {scanning ? (
            <Text style={{fontSize: 10}}>...</Text>
            ) : (
            <Ionicons name="camera" size={24} color="#007AFF" />
            )}
        </TouchableOpacity> */}
        

        <Text style={styles.hint}>
        *Photo is required for verification even if typing manually.
        </Text>
    </View>
    )}

      {/* Action Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSignUp} disabled={loading}>
        <Text style={styles.submitText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
      </TouchableOpacity>

      {/* Navigate to Login */}
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={{ color: '#666' }}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: '#1E90FF', marginTop: 5, fontWeight: 'bold' }}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}