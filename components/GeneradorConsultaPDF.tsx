import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
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
  
  heroTitle: { fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase', color: '#0f172a', marginBottom: 20, letterSpacing: -0.5 },
  
  sectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', marginBottom: 10, marginTop: 15, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: '#3b82f6' },
  
  box: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between' },
  boxItem: { flex: 1, alignItems: 'center' },
  boxLabel: { fontSize: 6, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4, fontWeight: 'bold' },
  boxValue: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  
  table: { width: '100%', marginBottom: 15 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingVertical: 6, paddingHorizontal: 4 },
  colLabel: { width: '30%', fontSize: 8, color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' },
  colValue: { width: '70%', fontSize: 9, color: '#0f172a' },
  
  // STRATEGY SUMMARY
  summaryBox: { backgroundColor: '#0f172a', color: '#ffffff', padding: 15, borderRadius: 8, marginBottom: 20 },
  summaryLabel: { fontSize: 7, color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 },
  
  // DNA BAR
  dnaBarContainer: { height: 4, backgroundColor: '#334155', borderRadius: 2, overflow: 'hidden', flexDirection: 'row', marginTop: 10 },
  dnaP: { height: '100%', backgroundColor: '#3b82f6' },
  dnaC: { height: '100%', backgroundColor: '#94a3b8' },
  dnaG: { height: '100%', backgroundColor: '#64748b' },

  mealCard: { marginBottom: 12, borderLeftWidth: 1, borderLeftColor: '#f1f5f9', paddingLeft: 10 },
  mealTitle: { fontSize: 10, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  mealItems: { fontSize: 8, color: '#64748b' },

  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerBrand: { fontSize: 8, fontWeight: 'bold', color: '#0f172a' },
  footerPage: { fontSize: 7, color: '#94a3b8' }
});

export const GeneradorConsultaPDF = ({ paciente, data }: any) => {
  const syncAn = data?.anamnesis || {};
  const an = syncAn.anamnesis || {};
  const resMetabolico = syncAn.resultados || {};
  
  const syncAntro = data?.antropometria || {};
  const mediciones = syncAntro.mediciones || {};
  const resultadosAntro = syncAntro.resultados || {};
  
  const syncDieta = data?.dieta || {};
  const meals = syncDieta.meals || [];
  const macrosTotales = syncDieta.totals || { kcal: 0, p: 0, c: 0, g: 0 };
  
  const pacienteNombre = `${paciente?.nombre || ''} ${paciente?.apellido || ''}`;
  const totalMacros = (macrosTotales.p || 0) + (macrosTotales.c || 0) + (macrosTotales.g || 0) || 1;

  const totalWeight = parseFloat(mediciones.weight || mediciones.peso || an.peso || '0');
  const fatPct = resultadosAntro.porcentajeGrasa || 0;
  const muscleKg = resultadosAntro.masaMagraKg || 0;
  const musclePct = totalWeight > 0 ? (muscleKg / totalWeight) * 100 : 0;
  const otherPct = Math.max(0, 100 - (fatPct + musclePct));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src="/logo.png" style={styles.logoIcon} />
            <View style={styles.headerText}>
              <Text style={styles.brandName}>Guido Operuk</Text>
              <Text style={styles.brandSub}>Protocolo de Intervención Clínica</Text>
            </View>
          </View>
          <View style={styles.patientBox}>
            <Text style={styles.patientName}>{pacienteNombre}</Text>
            <Text style={styles.date}>Sesión: {new Date().toLocaleDateString('es-AR')}</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Reporte de Evolución Nutricional</Text>

        {/* 1. COMPOSICIÓN CORPORAL & METABOLISMO */}
        <View style={{ flexDirection: 'row', gap: 15, marginBottom: 20 }}>
          <View style={[styles.summaryBox, { flex: 1, marginBottom: 0 }]}>
            <Text style={styles.summaryLabel}>Arquitectura Energética</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
               <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{Math.round(macrosTotales.kcal || resMetabolico.get || 0)} <Text style={{ fontSize: 10, color: '#3b82f6' }}>KCAL</Text></Text>
               <Text style={{ fontSize: 7, color: '#94a3b8' }}>P:{Math.round(macrosTotales.p)}g C:{Math.round(macrosTotales.c)}g G:{Math.round(macrosTotales.g)}g</Text>
            </View>
            <View style={styles.dnaBarContainer}>
              <View style={[styles.dnaP, { width: `${(macrosTotales.p / totalMacros) * 100}%` }]} />
              <View style={[styles.dnaC, { width: `${(macrosTotales.c / totalMacros) * 100}%` }]} />
              <View style={[styles.dnaG, { width: `${(macrosTotales.g / totalMacros) * 100}%` }]} />
            </View>
          </View>

          {fatPct > 0 && (
            <View style={[styles.summaryBox, { flex: 1, marginBottom: 0, backgroundColor: '#f8fafc', borderBlockColor: '#e2e8f0', borderWidth: 1 }]}>
               <Text style={[styles.summaryLabel, { color: '#64748b' }]}>Bio-Composición</Text>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0f172a' }}>{fatPct.toFixed(1)} <Text style={{ fontSize: 10, color: '#ef4444' }}>% GRASA</Text></Text>
                  <Text style={{ fontSize: 7, color: '#94a3b8' }}>M.MAGRA: {muscleKg.toFixed(1)}kg</Text>
               </View>
               <View style={[styles.dnaBarContainer, { backgroundColor: '#e2e8f0' }]}>
                  <View style={{ height: '100%', backgroundColor: '#ef4444', width: `${fatPct}%` }} />
                  <View style={{ height: '100%', backgroundColor: '#10b981', width: `${musclePct}%` }} />
                  <View style={{ height: '100%', backgroundColor: '#94a3b8', width: `${otherPct}%` }} />
               </View>
            </View>
          )}
        </View>

        {/* 2. EVALUACIÓN DE CONTEXTO */}
        <Text style={styles.sectionTitle}>1. Evaluación Antropométrica & Contexto</Text>
        <View style={styles.box}>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>IMC Actual</Text>
            <Text style={styles.boxValue}>{resultadosAntro.imc || '-'}</Text>
          </View>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>% Grasa</Text>
            <Text style={styles.boxValue}>{resultadosAntro.porcentajeGrasa ? resultadosAntro.porcentajeGrasa.toFixed(1) : '-'}%</Text>
          </View>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>Masa Magra</Text>
            <Text style={styles.boxValue}>{resultadosAntro.masaMagraKg ? resultadosAntro.masaMagraKg.toFixed(1) : '-'}kg</Text>
          </View>
          <View style={styles.boxItem}>
            <Text style={styles.boxLabel}>Peso</Text>
            <Text style={styles.boxValue}>{mediciones.weight || mediciones.peso || an.peso || '-'}kg</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.colLabel}>Perfil & Motivo</Text>
            <Text style={styles.colValue}>{an.motivoConsulta || 'Optimización'} • Ocupación: {an.ocupacion || '-'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colLabel}>Antecedentes & Clínica</Text>
            <Text style={styles.colValue}>{an.patologias || 'Sin antecedentes'} • Alergias: {an.alergiasIntolerancias || 'Ninguna'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colLabel}>Medicación & Suplementos</Text>
            <Text style={styles.colValue}>RX: {an.medicacionActual || 'Ninguna'} • SUP: {an.suplementacion || 'Ninguno'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colLabel}>Biología del Hábito</Text>
            <Text style={styles.colValue}>
              SUEÑO: {an.horasSueno || '-'}h • ESTRÉS: {an.nivelEstres || '-'}/10 • HIDRATACIÓN: {an.hidratacion || '-'} • DIGESTIÓN: {an.ritmoIntestinal || '-'}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colLabel}>Actividad & Deporte</Text>
            <Text style={styles.colValue}>{an.nivelActividad || '-'} • {an.frecuenciaEntrenamiento || '-'} sesiones/semana</Text>
          </View>
        </View>

        {/* 3. RESUMEN DE PLANIFICACIÓN */}
        {meals.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>2. Resumen de la Estrategia Alimentaria</Text>
            <View style={{ marginTop: 5 }}>
              {meals.map((meal: any, i: number) => (
                <View key={i} style={styles.mealCard} wrap={false}>
                  <Text style={styles.mealTitle}>{meal.nombre}</Text>
                  <Text style={styles.mealItems}>
                    {meal.items.map((it: any) => `${it.nombre} (${it.gramos}g)`).join(' • ')}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* INDICACIONES FINALES */}
        <View style={{ marginTop: 25, padding: 15, borderLeftWidth: 3, borderLeftColor: '#3b82f6', backgroundColor: '#f8fafc' }}>
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', marginBottom: 5 }}>Indicaciones del Profesional</Text>
          <Text style={{ fontSize: 8, color: '#64748b', lineHeight: 1.5 }}>
            Se sugiere seguimiento estricto de las porciones para garantizar el cumplimiento de los objetivos metabólicos. 
            Mantener una ingesta hídrica constante y reportar cualquier síntoma digestivo o cambio en el rendimiento físico.
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerBrand}>lic. guido operuk - ciencia aplicada</Text>
          <Text style={styles.footerPage} render={({ pageNumber, totalPages }) => (
            `Página ${pageNumber} de ${totalPages}`
          )} />
        </View>
      </Page>
    </Document>
  );
};
