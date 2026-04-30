import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { Mail, Lock, LogOut, CheckSquare, User } from 'lucide-react-native';

// --- CONFIGURAÇÃO (Coloque suas chaves aqui) ---
const SUPABASE_URL = 'https://zwtgjalalnynyijtgqzm.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3dGdqYWxhbG55bnlpanRncXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NjE4NTAsImV4cCI6MjA5MzEzNzg1MH0.98go7rp1u9icDSMs5vUqgyXyqFQ9Sfo0fvaHZei-VUM';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- PASSO 2: Auth Flow (Observador de Sessão) ---
  useEffect(() => {
    // Checa sessão atual ao abrir o app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuta mudanças (Login/Logout) em tempo real
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}><ActivityIndicator size="large" color="#2563EB" /></View>
    );
  }

  // Se houver sessão, mostra Home. Se não, mostra Login.
  return session ? <HomeScreen user={session.user} /> : <LoginScreen />;
}

// --- TELA DE LOGIN ---
function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  async function handleLogin() {
    setIsLogging(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLogging(false);
    if (error) Alert.alert('Erro', error.message);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Login</Text>
        <View style={styles.inputContainer}>
          <Mail color="#666" size={20} style={{marginRight: 10}} />
          <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" />
        </View>
        <View style={styles.inputContainer}>
          <Lock color="#666" size={20} style={{marginRight: 10}} />
          <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
        </View>
        <TouchableOpacity style={styles.buttonBlue} onPress={handleLogin} disabled={isLogging}>
          {isLogging ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- PASSO 3 & 4: TELA HOME (PROTEGIDA) ---
function HomeScreen({ user }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bem-vindo de volta!</Text>
        <User color="#FFF" size={24} />
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Olá!</Text>
          <Text style={styles.welcomeEmail}>{user.email}</Text>
        </View>

        <TouchableOpacity style={styles.buttonBlue}>
          <Text style={styles.buttonText}>Ir para Minhas Tarefas</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buttonLogout} 
          onPress={() => supabase.auth.signOut()}
        >
          <LogOut color="#DC2626" size={20} style={{marginRight: 10}} />
          <Text style={styles.buttonLogoutText}>Sair (Logout)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <View style={styles.tabItem}>
          <CheckSquare color="#2563EB" size={20} />
          <Text style={[styles.tabText, {color: '#2563EB'}]}>Tarefas</Text>
        </View>
        <View style={styles.tabItem}>
          <User color="#94A3B8" size={20} />
          <Text style={styles.tabText}>Perfil</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#1D61B9', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  card: { backgroundColor: '#FFF', padding: 25, borderRadius: 16, elevation: 4, margin: 20 },
  cardTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  welcomeCard: { backgroundColor: '#4ADE80', padding: 40, borderRadius: 20, alignItems: 'center', marginBottom: 30 },
  welcomeTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  welcomeEmail: { fontSize: 16, color: '#FFF', opacity: 0.9 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, height: 50 },
  input: { flex: 1 },
  buttonBlue: { backgroundColor: '#2563EB', height: 55, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  buttonLogout: { borderWidth: 1, borderColor: '#DC2626', height: 55, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  buttonLogoutText: { color: '#DC2626', fontSize: 16, fontWeight: 'bold' },
  tabBar: { height: 70, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  tabItem: { alignItems: 'center' },
  tabText: { fontSize: 12, marginTop: 4, color: '#94A3B8' }
});