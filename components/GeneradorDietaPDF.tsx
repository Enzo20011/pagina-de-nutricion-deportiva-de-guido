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
  page: {
    padding: 50,
    fontSize: 10,
    color: '#333',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 10,
    color: '#2563eb',
    marginTop: 4,
    fontWeight: 'bold',
  },
  patientInfo: {
    textAlign: 'right',
  },
  patientName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  date: {
    color: '#64748b',
    fontSize: 8,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#1e293b',
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#2563eb',
    paddingLeft: 10,
  },
  macroBox: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  table: {
    width: 'auto',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    minHeight: 30,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f1f5f9',
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    fontSize: 8,
  },
  colAlimento: { width: '40%', paddingLeft: 10 },
  colCantidad: { width: '20%', textAlign: 'center' },
  colMacros: { width: '25%', textAlign: 'center' },
  colKcal: { width: '15%', textAlign: 'right', paddingRight: 10 },
  footer: {
    marginTop: 50,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    alignItems: 'center',
  },
  footerLegal: {
    fontSize: 7,
    color: '#94a3b8',
    marginBottom: 4,
    textAlign: 'center',
  },
  footerSocial: {
    fontSize: 8,
    color: '#2563eb',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  references: {
    fontSize: 6,
    color: '#cbd5e1',
    textAlign: 'center',
    marginTop: 10,
  },
  bibliography: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
    opacity: 0.5,
  },
  bibItem: {
    fontSize: 5,
    color: '#94a3b8',
  }
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
        
        <View style={styles.references}>
          <Text>Nutrición real, sin vueltas. Ciencia aplicada al día a día.</Text>
        </View>
        
        <View style={styles.bibliography}>
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
