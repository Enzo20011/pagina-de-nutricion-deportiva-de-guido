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
  // Estructura sincronizada desde PanelClinico.tsx (syncObj)
  const syncAn = data?.anamnesis || {};
  const an = syncAn.anamnesis || {}; // Campos del formulario
  const resMetabolico = syncAn.resultados || {};
  
  // Estructura sincronizada desde PanelAntropometria.tsx (syncObj)
  const syncAntro = data?.antropometria || {};
  const mediciones = syncAntro.mediciones || {};
  const resultadosAntro = syncAntro.resultados || {};
  
  // Estructura sincronizada desde PlanAlimentario.tsx (syncObj)
  const syncDieta = data?.dieta || {};
  const meals = syncDieta.meals || [];
  const macrosTotales = syncDieta.totals || { kcal: 0, p: 0, c: 0, g: 0 };
  
  const pacienteNombre = `${paciente?.nombre || ''} ${paciente?.apellido || ''}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ENCABEZADO PROFESIONAL */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Guido Nutrición</Text>
            <Text style={styles.subtitle}>PROTOCOLO DE INTERVENCIÓN CLÍNICA</Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>PACIENTE: {pacienteNombre}</Text>
            <Text style={styles.date}>FECHA DE CONSULTA: {new Date().toLocaleDateString('es-AR')}</Text>
          </View>
        </View>

        {/* 1. EVALUACIÓN DE ESTADO INICIAL */}
        <Text style={styles.sectionTitle}>1. Evaluación Inicial y Contexto</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.colLabel}>Motivo de Consulta</Text>
            <Text style={styles.colValue}>{an.motivoConsulta || 'Control y planificación'}</Text>
          </View>
          <View style={styles.tableRow}>
             <Text style={styles.colLabel}>Perfil y Ocupación</Text>
             <Text style={styles.colValue}>{an.ocupacion || '-'} • Medicación: {an.medicacionActual || 'Ninguna'}</Text>
          </View>
          <View style={styles.tableRow}>
             <Text style={styles.colLabel}>Antecedentes / Alergias</Text>
             <Text style={styles.colValue}>
               {an.patologias || 'Sin patologías'} • {an.alergiasIntolerancias || 'Sin alergias reportadas'}
             </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colLabel}>Datos Físicos Actuales</Text>
            <Text style={styles.colValue}>
              EDAD: {an.edad || '-'} años • PESO: {mediciones.weight || mediciones.peso || an.weight || an.peso || '-'} KG • ALTURA: {mediciones.height || mediciones.altura || an.height || an.altura || '-'} CM
            </Text>
          </View>
        </View>

        {/* 2. HÁBITOS Y ESTILO DE VIDA */}
        <Text style={styles.sectionTitle}>2. Hábitos y Biología del Estilo de Vida</Text>
        <View style={styles.box}>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>Actividad</Text>
            <Text style={styles.boxValue}>{an.nivelActividad || '-'}</Text>
          </View>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>Descanso (h)</Text>
            <Text style={styles.boxValue}>{an.horasSueno || '-'} H</Text>
          </View>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>Estrés /10</Text>
            <Text style={styles.boxValue}>{an.nivelEstres || '-'}</Text>
          </View>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>Digestión</Text>
            <Text style={styles.boxValue}>{an.ritmoIntestinal || '-'}</Text>
          </View>
        </View>

        {/* 3. PARÁMETROS ANTROPOMÉTRICOS (Si hay mediciones) */}
        {(resultadosAntro.porcentajeGrasa || resultadosAntro.masaMagraKg) && (
          <>
            <Text style={styles.sectionTitle}>3. Composición Corporal (Bio-Análisis)</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.colLabel}>Porcentaje de Grasa</Text>
                <Text style={styles.colValue}>{resultadosAntro.porcentajeGrasa ? resultadosAntro.porcentajeGrasa.toFixed(1) : '-'} %</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.colLabel}>Masa Libre de Grasa</Text>
                <Text style={styles.colValue}>{resultadosAntro.masaMagraKg ? resultadosAntro.masaMagraKg.toFixed(1) : '-'} KG</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.colLabel}>Índice de Masa Corporal</Text>
                <Text style={styles.colValue}>{resultadosAntro.imc || '-'}</Text>
              </View>
            </View>
          </>
        )}

        {/* 4. ARQUITECTURA METABÓLICA Y MACROS */}
        <Text style={styles.sectionTitle}>4. Estrategia y Objetivos Energéticos</Text>
        <View style={styles.box}>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>Gasto Total (GET)</Text>
            <Text style={styles.boxValue}>{Math.round(macrosTotales.kcal || resMetabolico.get || 0)} KCAL</Text>
          </View>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>Proteína</Text>
            <Text style={styles.boxValue}>{Math.round(macrosTotales.p)}g</Text>
          </View>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>Carbohidratos</Text>
            <Text style={styles.boxValue}>{Math.round(macrosTotales.c)}g</Text>
          </View>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>Grasas</Text>
            <Text style={styles.boxValue}>{Math.round(macrosTotales.g)}g</Text>
          </View>
        </View>

        {/* 5. PLANIFICACIÓN DIETÉTICA */}
        {meals.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>5. Detalle de Alimentación Sugerida</Text>
            {meals.map((meal: any, i: number) => meal.items?.length > 0 && (
              <View key={i} wrap={false} style={{ marginBottom: 15 }}>
                <Text style={styles.mealTitle}>{meal.nombre}</Text>
                <View style={styles.mealTable}>
                  <View style={styles.mealHeader}>
                    <Text style={[styles.mCol1, { color: '#64748b', fontSize: 8 }]}>INGREDIENTE / ALIMENTO</Text>
                    <Text style={[styles.mCol2, { color: '#64748b', fontSize: 8 }]}>CANTIDAD</Text>
                    <Text style={[styles.mCol3, { color: '#64748b', fontSize: 8 }]}>KCAL</Text>
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
          </>
        )}

        {/* FIRMA PROFESIONAL */}
        <View style={styles.footer} wrap={false}>
          <Text style={styles.footerText}>Guido Operuk</Text>
          <Text style={styles.footerSub}>Licenciado en Nutrición • CIENCIA APLICADA AL RENDIMIENTO</Text>
        </View>
      </Page>
    </Document>
  );
};
