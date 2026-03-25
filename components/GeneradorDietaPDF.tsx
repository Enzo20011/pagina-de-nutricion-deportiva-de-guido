'use client';

import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Font 
} from '@react-pdf/renderer';

// Fuentes (opcional, se pueden usar fuentes estándar para evitar problemas de carga)
// Font.register({ family: 'Inter', src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKOBj27A.woff2' });

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', color: '#0f172a' },
  header: { borderBottomWidth: 2, borderBottomColor: '#3b82f6', paddingBottom: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  title: { fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase', color: '#0f172a', letterSpacing: 1 },
  subtitle: { fontSize: 9, color: '#3b82f6', marginTop: 4, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  patientInfo: { textAlign: 'right' },
  patientName: { fontSize: 12, fontWeight: 'bold', color: '#0f172a' },
  date: { fontSize: 8, color: '#64748b', marginTop: 2 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', marginBottom: 12, marginTop: 20, borderLeftWidth: 3, borderLeftColor: '#3b82f6', paddingLeft: 8 },
  macroBox: { backgroundColor: '#f8fafc', padding: 20, borderRadius: 4, marginBottom: 25, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', flexDirection: 'row', justifyContent: 'space-around' },
  macroItem: { alignItems: 'center' },
  macroLabel: { fontSize: 7, color: '#64748b', textTransform: 'uppercase', marginBottom: 4, fontWeight: 'bold' },
  macroValue: { fontSize: 14, fontWeight: 'bold', color: '#3b82f6' },
  table: { width: '100%', marginBottom: 20 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', minHeight: 25, alignItems: 'center' },
  tableHeader: { backgroundColor: '#f8fafc', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  hText: { fontSize: 8, color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' },
  colAlimento: { width: '45%', paddingLeft: 8, fontSize: 10 },
  colCantidad: { width: '20%', textAlign: 'center', fontSize: 10 },
  colMacros: { width: '20%', textAlign: 'center', fontSize: 9, color: '#64748b' },
  colKcal: { width: '15%', textAlign: 'right', paddingRight: 8, fontSize: 10, fontWeight: 'bold' },
  footer: { marginTop: 40, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#e2e8f0', alignItems: 'center' },
  footerLegal: { fontSize: 8, color: '#64748b', textAlign: 'center', marginBottom: 6, fontStyle: 'italic' },
  footerSocial: { fontSize: 10, color: '#3b82f6', fontWeight: 'bold', marginBottom: 15 },
  bibContainer: { flexDirection: 'row', gap: 10, opacity: 0.3, marginTop: 10 },
  bibItem: { fontSize: 6, color: '#94a3b8' }
});

interface Props {
  paciente: {
    nombre: string;
    edad: number;
  };
  macros: {
    kcal: number;
    p: number;
    c: number;
    g: number;
  };
  dieta: any[];
}

export const GeneradorDietaPDF = ({ paciente, macros, dieta }: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Plan Alimentario</Text>
          <Text style={styles.subtitle}>Lic. Guido Operuk - Nutrición Clínica & Deportiva</Text>
        </View>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{paciente.nombre}</Text>
          <Text style={styles.date}>Generado: {new Date().toLocaleDateString('es-AR')}</Text>
        </View>
      </View>

      {/* METABOLIC OBJECTIVES */}
      <View style={styles.macroBox}>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Energía</Text>
          <Text style={styles.macroValue}>{macros.kcal} kcal</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Proteína</Text>
          <Text style={styles.macroValue}>{macros.p}g</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Carbohidratos</Text>
          <Text style={styles.macroValue}>{macros.c}g</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Grasas</Text>
          <Text style={styles.macroValue}>{macros.g}g</Text>
        </View>
      </View>

      {/* DIET BODY */}
      {dieta.map((comida, idx) => (
        <View key={idx} wrap={false} style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>{comida.nombre}</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.colAlimento}>Alimento</Text>
              <Text style={styles.colCantidad}>Gramos</Text>
              <Text style={styles.colMacros}>P / C / G</Text>
              <Text style={styles.colKcal}>Kcal</Text>
            </View>
            {comida.items.map((item: any, i: number) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.colAlimento}>{item.nombre}</Text>
                <Text style={styles.colCantidad}>{item.gramos}g</Text>
                <Text style={styles.colMacros}>{item.p} / {item.c} / {item.g}</Text>
                <Text style={styles.colKcal}>{item.kcal}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerLegal}>Plan generado automáticamente para uso exclusivo del paciente. Control sugerido en 15 días.</Text>
        <Text style={styles.footerSocial}>Seguime en Instagram para más tips: @lic.guidooperuk</Text>
        
        <View style={styles.bibContainer}>
          <Text style={styles.bibItem}>BEDCA (2023)</Text>
          <Text style={styles.bibItem}>USDA (2023)</Text>
          <Text style={styles.bibItem}>OMS (2020)</Text>
          <Text style={styles.bibItem}>Academy of Nutrition and Dietetics (2022)</Text>
          <Text style={styles.bibItem}>Martínez-González & Sánchez-Villegas (2021)</Text>
        </View>
      </View>
    </Page>
  </Document>
);
