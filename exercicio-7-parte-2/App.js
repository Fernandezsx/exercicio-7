import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { createClient } from '@supabase/supabase-js'; // Importação do cliente
import { Mail, Lock, EyeOff } from 'lucide-react-native';

// --- CONFIGURAÇÃO DO SUPABASE (Substitua pelos seus dados) ---
const SUPABASE_URL = 'https://zwtgjalalnynyijtgqzm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3dGdqYWxhbG55bnlpanRncXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NjE4NTAsImV4cCI6MjA5MzEzNzg1MH0.98go7rp1u9icDSMs5vUqgyXyqFQ9Sfo0fvaHZei-VUM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// -----------------------------------------------------------

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      Alert.alert('Sucesso', `Bem-vindo, ${data.user.email}!`);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.iconCircle}>
          <Text style={styles.boltIcon}>⚡</Text>
        </View>
        <Text style={styles.appName}>TaskApp</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.inputContainer}>
          <Mail color="#666" size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock color="#666" size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <EyeOff color="#666" size={20} />
        </View>

        <TouchableOpacity 
          style={styles.buttonPrimary} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.buttonSecondary}>
          <Text style={styles.buttonSecondaryText}>Criar conta gratuita</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotText}>Esqueci minha senha</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9FF', padding: 20, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center' },
  boltIcon: { fontSize: 40, color: '#FFF' },
  appName: { fontSize: 32, fontWeight: 'bold', color: '#0F172A', marginTop: 10 },
  subtitle: { color: '#64748B', fontSize: 16 },
  card: { backgroundColor: '#FFF', padding: 25, borderRadius: 16, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, height: 55 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  buttonPrimary: { backgroundColor: '#2563EB', height: 55, borderRadius: 27, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { marginHorizontal: 10, color: '#94A3B8' },
  buttonSecondary: { borderWidth: 1, borderColor: '#2563EB', height: 55, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
  buttonSecondaryText: { color: '#2563EB', fontSize: 16, fontWeight: '600' },
  forgotPassword: { marginTop: 25, alignItems: 'center' },
  forgotText: { color: '#64748B', textDecorationLine: 'underline' }
});