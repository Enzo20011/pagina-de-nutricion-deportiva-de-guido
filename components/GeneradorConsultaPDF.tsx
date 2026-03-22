import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', color: '#0f172a' },
  header: { borderBottomWidth: 2, borderBottomColor: '#3b82f6', paddingBottom: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase', color: '#0f172a' },
  subtitle: { fontSize: 10, color: '#64748b', marginTop: 4, textTransform: 'uppercase' },
  patientInfo: { textAlign: 'right' },
  patientName: { fontSize: 12, fontWeight: 'bold' },
  date: { fontSize: 10, color: '#3b82f6', marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#3b82f6', textTransform: 'uppercase', marginBottom: 10, marginTop: 20 },
  box: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between' },
  boxItem: { flex: 1, alignItems: 'center' },
  boxLabel: { fontSize: 8, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 },
  boxValue: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  table: { width: '100%', marginBottom: 15 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingVertical: 5 },
  colLabel: { width: '30%', fontSize: 9, color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' },
  colValue: { width: '70%', fontSize: 10, color: '#0f172a' },
  mealTitle: { fontSize: 12, fontWeight: 'bold', color: '#0f172a', marginBottom: 5, marginTop: 10 },
  mealTable: { width: '100%', marginBottom: 10 },
  mealHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 5, marginBottom: 5 },
  mealRow: { flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  mCol1: { width: '50%', fontSize: 10 },
  mCol2: { width: '25%', fontSize: 10, color: '#3b82f6', textAlign: 'center' },
  mCol3: { width: '25%', fontSize: 10, textAlign: 'right', fontWeight: 'bold' },
  footer: { marginTop: 40, padding: 20, backgroundColor: '#0f172a', borderRadius: 10, alignItems: 'center' },
  footerText: { color: '#3b82f6', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 },
  footerSub: { color: '#94a3b8', fontSize: 8, marginTop: 4 }
});

export const GeneradorConsultaPDF = ({ paciente, data }: any) => {
  const an = data?.anamnesis?.anamnesis || {};
  const antro = data?.antropometria?.mediciones || {};
  const comp = data?.antropometria || {};
  const meals = data?.dieta?.meals || [];
  const macros = data?.dieta?.totals || { kcal: 0, p: 0, c: 0, g: 0 };
  const pacienteNombre = `${paciente?.nombre || ''} ${paciente?.apellido || ''}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Guido Nutrición</Text>
            <Text style={styles.subtitle}>Historia Clínica Integral</Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>Paciente: {pacienteNombre}</Text>
            <Text style={styles.date}>Fecha: {new Date().toLocaleDateString('es-AR')}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>1. Cuadro Clínico General</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.colLabel}>Motivo Consulta</Text>
            <Text style={styles.colValue}>{an.motivoConsulta || 'No especificado'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colLabel}>Patologías / Alergias</Text>
            <Text style={styles.colValue}>{an.patologias || 'Ninguna'} / {an.alergiasIntolerancias || 'Sin alergias'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colLabel}>Nivel Actividad</Text>
            <Text style={styles.colValue}>{an.nivelActividad || 'Sedentario'} • Sueño: {an.horasSueno || '-'}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>2. Composición Corporal</Text>
        <View style={styles.box}>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>Peso Base</Text>
            <Text style={styles.boxValue}>{antro.peso || '-'} kg</Text>
          </View>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>Densidad Grasa</Text>
            <Text style={styles.boxValue}>{comp.grasaPct || '-'} %</Text>
          </View>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>Masa Magra</Text>
            <Text style={styles.boxValue}>{comp.masaMagraKg || '-'} kg</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>3. Arquitectura Dietética</Text>
        <View style={styles.box}>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>Impacto Energético</Text>
            <Text style={styles.boxValue}>{Math.round(macros.kcal)} KCAL</Text>
          </View>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>Proteína</Text>
            <Text style={styles.boxValue}>{Math.round(macros.p)}g</Text>
          </View>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>Carbohidratos</Text>
            <Text style={styles.boxValue}>{Math.round(macros.c)}g</Text>
          </View>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>Lípidos</Text>
            <Text style={styles.boxValue}>{Math.round(macros.g)}g</Text>
          </View>
        </View>

        {meals.map((meal: any, i: number) => meal.items?.length > 0 && (
          <View key={i} wrap={false} style={{ marginBottom: 10 }}>
            <Text style={styles.mealTitle}>{meal.nombre}</Text>
            <View style={styles.mealTable}>
              <View style={styles.mealHeader}>
                <Text style={[styles.mCol1, { color: '#64748b', fontSize: 9 }]}>INGREDIENTE</Text>
                <Text style={[styles.mCol2, { color: '#64748b', fontSize: 9 }]}>CANTIDAD</Text>
                <Text style={[styles.mCol3, { color: '#64748b', fontSize: 9 }]}>KCAL</Text>
              </View>
              {meal.items.map((item: any, j: number) => (
                <View key={j} style={styles.mealRow}>
                  <Text style={styles.mCol1}>{item.nombre}</Text>
                  <Text style={styles.mCol2}>{item.gramos}g</Text>
                  <Text style={styles.mCol3}>{Math.round((item.kcal * item.gramos) / 100)}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer} wrap={false}>
          <Text style={styles.footerText}>Guido Operuk</Text>
          <Text style={styles.footerSub}>Lic. en Nutrición Clínica y Deportiva</Text>
        </View>
      </Page>
    </Document>
  );
};
