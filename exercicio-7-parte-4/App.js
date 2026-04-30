import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  FlatList, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { Mail, Lock, LogOut, Plus, Trash2, CheckCircle, Circle } from 'lucide-react-native';

// --- CONFIGURAÇÃO DO SUPABASE ---
// Substitua pelas suas credenciais do painel: Settings > API
const SUPABASE_URL = 'https://zwtgjalalnynyijtgqzm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3dGdqYWxhbG55bnlpanRncXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NjE4NTAsImV4cCI6MjA5MzEzNzg1MH0.98go7rp1u9icDSMs5vUqgyXyqFQ9Sfo0fvaHZei-VUM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  const [session, setSession] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Checa sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitializing(false);
    });

    // Escuta mudanças de auth (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return session ? <TarefasScreen session={session} /> : <LoginScreen />;
}

// --- TELA DE LOGIN / CADASTRO ---
function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAuth(type) {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    
    setLoading(false);
    if (error) Alert.alert('Erro', error.message);
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.authContent}>
        <Text style={styles.authTitle}>TaskApp</Text>
        <Text style={styles.authSubtitle}>Gerencie suas tarefas com segurança</Text>

        <View style={styles.inputContainer}>
          <Mail color="#64748B" size={20} style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="E-mail" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock color="#64748B" size={20} style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="Senha" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
          />
        </View>

        <TouchableOpacity 
          style={styles.btnPrimary} 
          onPress={() => handleAuth('login')}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Entrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnSecondary} 
          onPress={() => handleAuth('signup')}
          disabled={loading}
        >
          <Text style={styles.btnSecondaryText}>Criar Nova Conta</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// --- TELA DE TAREFAS (PROTEGIDA POR RLS) ---
function TarefasScreen({ session }) {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchTarefas();
  }, []);

  async function fetchTarefas() {
    setFetching(true);
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .order('id', { ascending: false });

    if (!error) setTarefas(data);
    setFetching(false);
  }

  async function adicionarTarefa() {
    if (!novaTarefa.trim()) return;
    
    const { error } = await supabase
      .from('tarefas')
      .insert([{ titulo: novaTarefa, user_id: session.user.id }]);

    if (error) Alert.alert('Erro ao salvar', error.message);
    else {
      setNovaTarefa('');
      fetchTarefas();
    }
  }

  async function deletarTarefa(id) {
    const { error } = await supabase.from('tarefas').delete().eq('id', id);
    if (error) Alert.alert('Erro ao deletar', error.message);
    else fetchTarefas();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Minhas Tarefas</Text>
          <Text style={styles.headerEmail}>{session.user.email}</Text>
        </View>
        <TouchableOpacity onPress={() => supabase.auth.signOut()}>
          <LogOut color="#FFF" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.addTaskArea}>
        <TextInput 
          style={styles.addInput} 
          placeholder="O que precisa ser feito?" 
          value={novaTarefa}
          onChangeText={setNovaTarefa}
        />
        <TouchableOpacity style={styles.btnAdd} onPress={adicionarTarefa}>
          <Plus color="#FFF" size={28} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View style={styles.taskInfo}>
              <Circle color="#CBD5E1" size={20} style={{marginRight: 10}} />
              <Text style={styles.taskText}>{item.titulo}</Text>
            </View>
            <TouchableOpacity onPress={() => deletarTarefa(item.id)}>
              <Trash2 color="#EF4444" size={20} />
            </TouchableOpacity>
          </View>
        )}
        refreshing={fetching}
        onRefresh={fetchTarefas}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma tarefa por aqui...</Text>
        }
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  // Auth Styles
  authContent: { flex: 1, justifyContent: 'center', padding: 30 },
  authTitle: { fontSize: 40, fontWeight: '900', color: '#1E40AF', textAlign: 'center' },
  authSubtitle: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 40 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    marginBottom: 15, 
    height: 60,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  btnPrimary: { backgroundColor: '#2563EB', height: 60, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  btnSecondary: { marginTop: 20, alignItems: 'center' },
  btnSecondaryText: { color: '#2563EB', fontWeight: '600' },
  // Home Styles
  header: { 
    backgroundColor: '#1E40AF', 
    padding: 25, 
    paddingTop: 60, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  headerGreeting: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  headerEmail: { color: '#BFDBFE', fontSize: 14 },
  addTaskArea: { flexDirection: 'row', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  addInput: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 12, paddingHorizontal: 15, height: 50, marginRight: 10 },
  btnAdd: { backgroundColor: '#2563EB', width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  taskCard: { 
    backgroundColor: '#FFF', 
    padding: 18, 
    borderRadius: 15, 
    marginBottom: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  taskInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  taskText: { fontSize: 16, color: '#334155', fontWeight: '500' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#94A3B8', fontSize: 16 }
});