'use client';

import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Font,
  Image 
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', color: '#0f172a' },
  header: { borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 15, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoIcon: { width: 32, height: 32 },
  headerText: { flexDirection: 'column' },
  brandName: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', letterSpacing: 0.5 },
  brandSub: { fontSize: 7, color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  patientBox: { textAlign: 'right' },
  patientName: { fontSize: 10, fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase' },
  date: { fontSize: 7, color: '#64748b', marginTop: 2 },
  
  heroTitle: { fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase', color: '#0f172a', marginBottom: 20, letterSpacing: -0.5 },
  
  summarySection: { backgroundColor: '#f8fafc', borderRadius: 8, padding: 20, borderTopWidth: 3, borderTopColor: '#3b82f6', marginBottom: 25 },
  summaryHeader: { fontSize: 9, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 },
  macroGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  macroItem: { flex: 1 },
  macroLabel: { fontSize: 6, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4, fontWeight: 'bold' },
  macroValue: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  macroUnit: { fontSize: 8, color: '#64748b', marginLeft: 1 },
  
  // DNA BAR
  dnaBarContainer: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, overflow: 'hidden', flexDirection: 'row' },
  dnaP: { height: '100%', backgroundColor: '#3b82f6' },
  dnaC: { height: '100%', backgroundColor: '#94a3b8' },
  dnaG: { height: '100%', backgroundColor: '#cbd5e1' },
  dnaLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  dnaLabelText: { fontSize: 6, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' },

  sectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', marginBottom: 10, marginTop: 15, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: '#3b82f6' },
  
  mealCard: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 15 },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  mealName: { fontSize: 11, fontWeight: 'bold', color: '#0f172a' },
  mealEnergy: { fontSize: 8, color: '#3b82f6', fontWeight: 'bold' },
  
  table: { width: '100%' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f8fafc', padding: 6, borderRadius: 4, marginBottom: 4 },
  hText: { fontSize: 7, color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 6, alignItems: 'center' },
  colAlimento: { width: '50%', fontSize: 9, color: '#334155' },
  colCantidad: { width: '20%', textAlign: 'center', fontSize: 9, color: '#64748b' },
  colMacros: { width: '15%', textAlign: 'center', fontSize: 8, color: '#94a3b8' },
  colKcal: { width: '15%', textAlign: 'right', fontSize: 9, fontWeight: 'bold', color: '#0f172a' },
  
  zebraRow: { backgroundColor: '#fcfdfe' },

  disclaimer: { marginTop: 30, padding: 15, backgroundColor: '#f1f5f9', borderRadius: 4 },
  disclaimerTitle: { fontSize: 7, fontWeight: 'bold', color: '#475569', textTransform: 'uppercase', marginBottom: 4 },
  disclaimerText: { fontSize: 7, color: '#64748b', lineHeight: 1.4 },
  
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerBrand: { fontSize: 8, fontWeight: 'bold', color: '#0f172a' },
  footerPage: { fontSize: 7, color: '#94a3b8' }
});

interface Props {
  paciente: {
    nombre: string;
    edad: number;
    apellido?: string;
  };
  macros: {
    kcal: number;
    p: number;
    c: number;
    g: number;
  };
  dieta: any[];
}

export const GeneradorDietaPDF = ({ paciente, macros, dieta }: Props) => {
  const totalMacros = (macros.p || 0) + (macros.c || 0) + (macros.g || 0) || 1;
  const pPct = ((macros.p || 0) / totalMacros) * 100;
  const cPct = ((macros.c || 0) / totalMacros) * 100;
  const gPct = ((macros.g || 0) / totalMacros) * 100;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src="/logo.png" style={styles.logoIcon} />
            <View style={styles.headerText}>
              <Text style={styles.brandName}>Guido Operuk</Text>
              <Text style={styles.brandSub}>Nutrición Clínica & Deportiva</Text>
            </View>
          </View>
          <View style={styles.patientBox}>
            <Text style={styles.patientName}>{paciente.nombre} {paciente.apellido || ''}</Text>
            <Text style={styles.date}>Sesión: {new Date().toLocaleDateString('es-AR')}</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Plan Alimentario Personalizado</Text>

        {/* METABOLIC SUMMARY */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryHeader}>Objetivos Energéticos & Distribución</Text>
          <View style={styles.macroGrid}>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Energía Diaria</Text>
              <Text style={styles.macroValue}>{macros.kcal}<Text style={styles.macroUnit}>kcal</Text></Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Proteínas</Text>
              <Text style={styles.macroValue}>{macros.p}<Text style={styles.macroUnit}>g</Text></Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Carbohidratos</Text>
              <Text style={styles.macroValue}>{macros.c}<Text style={styles.macroUnit}>g</Text></Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Grasas Totales</Text>
              <Text style={styles.macroValue}>{macros.g}<Text style={styles.macroUnit}>g</Text></Text>
            </View>
          </View>

          {/* DNA MACRO BAR */}
          <View style={styles.dnaBarContainer}>
            <View style={[styles.dnaP, { width: `${pPct}%` }]} />
            <View style={[styles.dnaC, { width: `${cPct}%` }]} />
            <View style={[styles.dnaG, { width: `${gPct}%` }]} />
          </View>
          <View style={styles.dnaLabels}>
            <Text style={styles.dnaLabelText}>Proteína ({Math.round(pPct)}%)</Text>
            <Text style={styles.dnaLabelText}>Carbohidratos ({Math.round(cPct)}%)</Text>
            <Text style={styles.dnaLabelText}>Grasas ({Math.round(gPct)}%)</Text>
          </View>
        </View>

        {/* DIET ENTRIES */}
        <Text style={styles.sectionTitle}>Distribución de Ingestas</Text>
        
        {dieta.map((comida, idx) => {
          const mealKcal = (comida.items || []).reduce((acc: number, item: any) => acc + (Math.round((item.kcal * item.gramos) / 100) || 0), 0);
          
          return (
            <View key={idx} wrap={false} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{comida.nombre}</Text>
                <Text style={styles.mealEnergy}>{mealKcal} KCAL TOTALES</Text>
              </View>
              
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.hText, { width: '50%' }]}>Alimento / Descripción</Text>
                  <Text style={[styles.hText, { width: '20%', textAlign: 'center' }]}>Cantidad</Text>
                  <Text style={[styles.hText, { width: '15%', textAlign: 'center' }]}>P / C / G</Text>
                  <Text style={[styles.hText, { width: '15%', textAlign: 'right' }]}>Kcal</Text>
                </View>

                {comida.items.map((item: any, i: number) => (
                  <View key={i} style={[styles.tableRow, i % 2 !== 0 ? styles.zebraRow : {}]}>
                    <Text style={styles.colAlimento}>{item.nombre}</Text>
                    <Text style={styles.colCantidad}>{item.gramos}g</Text>
                    <Text style={styles.colMacros}>{item.p} / {item.c} / {item.g}</Text>
                    <Text style={styles.colKcal}>{Math.round((item.kcal * item.gramos) / 100)}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {/* DISCLAIMER */}
        <View style={styles.disclaimer} wrap={false}>
          <Text style={styles.disclaimerTitle}>Indicaciones Importantes</Text>
          <Text style={styles.disclaimerText}>
            Este plan ha sido diseñado específicamente según tus requerimientos metabólicos y objetivos actuales. 
            Se recomienda mantener una hidratación adecuada (30-35ml por kg de peso) y priorizar la calidad de los ingredientes. 
            Cualquier duda o ajuste necesario, consultarlo en la próxima sesión.
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerBrand}>lic. guido operuk - nutrición de élite</Text>
          <Text style={styles.footerPage} render={({ pageNumber, totalPages }) => (
            `Página ${pageNumber} de ${totalPages}`
          )} />
        </View>
      </Page>
    </Document>
  );
};
