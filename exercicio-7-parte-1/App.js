import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Mail, Server, Smartphone, Lightbulb } from 'lucide-react-native';

// --- PASSO 2: Tela InfoAuth ---
const InfoAuth = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1D61B9" />
      
      {/* Header Simulado */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Autenticação Mobile</Text>
      </View>

      <View style={styles.content}>
        {/* PASSO 3: Card Centralizado */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Como funciona o Login?</Text>

          {/* Item 1 */}
          <View style={styles.stepRow}>
            <View style={styles.iconCircle}>
              <Mail color="#1D61B9" size={24} />
              <View style={styles.badge}><Text style={styles.badgeText}>1</Text></View>
            </View>
            <Text style={styles.stepText}>Usuário envia email + senha</Text>
          </View>

          {/* Item 2 */}
          <View style={styles.stepRow}>
            <View style={styles.iconCircle}>
              <Server color="#1D61B9" size={24} />
              <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
            </View>
            <Text style={styles.stepText}>Servidor valida e gera um Token JWT</Text>
          </View>

          {/* Item 3 */}
          <View style={styles.stepRow}>
            <View style={styles.iconCircle}>
              <Smartphone color="#1D61B9" size={24} />
              <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
            </View>
            <Text style={styles.stepText}>App salva o token e usa em todas as requisições</Text>
          </View>
        </View>

        {/* PASSO 4: Rodapé Informativo */}
        <View style={styles.infoFooter}>
          <Lightbulb color="#fff" size={20} style={{ marginRight: 10 }} />
          <Text style={styles.infoFooterText}>
            O Supabase Auth faz tudo isso automaticamente!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

// --- PASSO 1: Stack Navigator ---
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="InfoAuth" component={InfoAuth} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- Estilização ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    backgroundColor: '#1D61B9',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    elevation: 5, // Sombra Android
    shadowColor: '#000', // Sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0D2C54',
    textAlign: 'center',
    marginBottom: 30,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  badge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#0D2C54',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#444',
    lineHeight: 20,
  },
  infoFooter: {
    backgroundColor: '#1D61B9',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    width: '100%',
  },
  infoFooterText: {
    color: '#FFF',
    fontSize: 14,
    flex: 1,
  },
});