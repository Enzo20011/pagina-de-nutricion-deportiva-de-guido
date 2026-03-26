import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';

// Colores Premium
const PRIMARY = '#1e293b'; // Slate 800
const ACCENT = '#3b82f6';  // Blue 500
const SECONDARY = '#64748b'; // Slate 500
const BORDER = '#e2e8f0';   // Slate 200
const LIGHT_BG = '#f8fafc'; // Slate 50
const SUCCESS = '#10b981';  // Emerald 500
const DANGER = '#ef4444';   // Red 500

const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontFamily: 'Helvetica', 
    color: PRIMARY, 
    backgroundColor: '#ffffff', 
    fontSize: 9,
    lineHeight: 1.5 
  },

  // HEADER SISTEMÁTICO
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 25,
    borderBottom: '2pt solid #1e293b',
    paddingBottom: 15
  },
  logoSection: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoImg: { width: 35, height: 35 },
  brandTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },
  brandSubtitle: { fontSize: 7, color: ACCENT, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 2 },
  
  headerMeta: { alignItems: 'flex-end' },
  patientName: { fontSize: 12, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase' },
  sessionInfo: { fontSize: 7, color: SECONDARY, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },

  // TITULO DE PÁGINA
  docHeader: {
    backgroundColor: LIGHT_BG,
    padding: 15,
    borderRadius: 4,
    marginBottom: 20,
    borderLeft: `4pt solid ${ACCENT}`
  },
  docTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1 },
  docSub: { fontSize: 7, color: SECONDARY, marginTop: 5, textTransform: 'uppercase', letterSpacing: 2 },

  // DASHBOARD DE MÉTRICAS (Resumen Ejecutivo)
  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  metricCard: { 
    flex: 1, 
    padding: 12, 
    backgroundColor: '#ffffff', 
    borderRadius: 4, 
    border: `1pt solid ${BORDER}`,
    alignItems: 'center'
  },
  metricCardDark: { 
    flex: 1, 
    padding: 12, 
    backgroundColor: PRIMARY, 
    borderRadius: 4, 
    alignItems: 'center'
  },
  metricLabel: { fontSize: 6, fontFamily: 'Helvetica-Bold', color: SECONDARY, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 },
  metricLabelWhite: { fontSize: 6, fontFamily: 'Helvetica-Bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 },
  metricValue: { fontSize: 18, fontFamily: 'Helvetica-Bold' },
  metricValueWhite: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  metricUnit: { fontSize: 8, color: ACCENT },
  
  // BARRA DE COMPOSICIÓN
  compBarContainer: { width: '100%', height: 4, backgroundColor: BORDER, borderRadius: 2, marginTop: 8, overflow: 'hidden', flexDirection: 'row' },
  barFat: { backgroundColor: DANGER, height: '100%' },
  barMuscle: { backgroundColor: SUCCESS, height: '100%' },
  barRemainder: { backgroundColor: '#cbd5e1', height: '100%' },

  // SECCIONES GENERALES
  section: { marginBottom: 20 },
  sectionTitle: { 
    fontSize: 9, 
    fontFamily: 'Helvetica-Bold', 
    backgroundColor: PRIMARY, 
    color: '#ffffff', 
    padding: '6 12', 
    borderRadius: 2, 
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1
  },

  // GRID DE DATOS (2 Columnas)
  dataGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dataBox: { 
    width: '48%', 
    padding: '8 10', 
    backgroundColor: LIGHT_BG, 
    borderRadius: 2, 
    borderBottom: `1pt solid ${BORDER}` 
  },
  dataLabel: { fontSize: 7, color: SECONDARY, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 2 },
  dataValue: { fontSize: 9, color: PRIMARY },

  // TABLA DE ANTROPOMETRÍA
  bioRow: { flexDirection: 'row', borderBottom: `1pt solid ${LIGHT_BG}`, paddingVertical: 6, paddingHorizontal: 4 },
  bioCol: { flex: 1 },
  bioText: { fontSize: 8 },
  bioLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: SECONDARY },

  // PLAN ALIMENTARIO
  planHeader: { flexDirection: 'row', backgroundColor: LIGHT_BG, padding: 8, borderBottom: `1pt solid ${ACCENT}`, marginBottom: 10 },
  planMacro: { flex: 1, alignItems: 'center' },
  planMacroVal: { fontSize: 12, fontFamily: 'Helvetica-Bold' },
  planMacroLabel: { fontSize: 6, color: SECONDARY, textTransform: 'uppercase' },

  mealCard: { marginBottom: 15, border: `1pt solid ${BORDER}`, borderRadius: 4, overflow: 'hidden' },
  mealTitle: { backgroundColor: LIGHT_BG, padding: 8, fontSize: 10, fontFamily: 'Helvetica-Bold', borderBottom: `1pt solid ${BORDER}` },
  mealContent: { padding: 8 },
  foodItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottom: `1pt solid #f1f5f9` },
  foodName: { fontSize: 8.5, flex: 2 },
  foodQty: { fontSize: 8, color: SECONDARY, flex: 0.5, textAlign: 'right' },
  foodMacros: { fontSize: 7, color: SECONDARY, flex: 1, textAlign: 'right' },

  // FOOTER
  footer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 40, 
    right: 40, 
    borderTop: `1pt solid ${BORDER}`, 
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: SECONDARY,
    fontSize: 7
  },

  notesContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#fffbeb', // Light amber
    border: '1pt solid #fef3c7',
    borderRadius: 4
  },
  notesTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: '#92400e', marginBottom: 5 },
  notesText: { fontSize: 8.5, color: '#92400e', lineHeight: 1.6 }
});

const val = (v: any, unit = '', fallback = '-') =>
    v !== undefined && v !== null && v !== '' ? `${v}${unit}` : fallback;

export const GeneradorConsultaPDF = ({ paciente, data }: any) => {
  // Parsing robusto de datos
  const syncAn = data?.anamnesis || {};
  const syncDieta = data?.dieta || {};
  const anamnesis = syncAn.anamnesis || {};
  const resultadosMetabolicos = syncAn.resultados || {};
  
  const targetKcal = syncAn.targetKcal || syncDieta?.targets?.targetKcal || 0;
  const tipoObjetivo = syncAn.tipoObjetivo || '-';

  // Combinar macros de ambas fuentes (Anamnesis o Plan)
  const mAn = syncAn.macros || {};
  const mPl = syncDieta?.targets?.targetMacros || {};
  
  const macrosObjetivo = {
    proteinas: mAn.proteinas || mPl.p || 0,
    carbohidratos: mAn.carbohidratos || mAn.carbos || mPl.c || 0,
    grasas: mAn.grasas || mAn.lipidos || mPl.f || mPl.g || 0
  };

  const syncAntro = data?.antropometria || {};
  const mediciones = syncAntro.mediciones || {};
  const perimetros = mediciones.perimetros || {};
  const pliegues = mediciones.pliegues || {};
  const resultadosAntro = syncAntro.resultados || {};
  const meals = syncDieta.meals || [];
  const totalsDieta = syncDieta.totals || {};

  const patientName = `${paciente?.data?.nombre || paciente?.nombre || ''} ${paciente?.data?.apellido || paciente?.apellido || ''} `.trim();
  const fechaStr = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Calculos de composición corporal para el gráfico
  const peso = mediciones.peso || anamnesis.peso || 0;
  const fatPct = resultadosAntro.porcentajeGrasa || 0;
  const muscleKg = resultadosAntro.masaMagraKg || 0;
  const musclePct = peso > 0 ? (muscleKg / peso) * 100 : 0;
  const bonePct = 14; 
  const residualPct = Math.max(0, 100 - (fatPct + musclePct + bonePct));

  return (
    <Document>
      {/* PÁGINA 1: EVALUACIÓN CLÍNICA Y ANTROPOMETRÍA */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Image src="/logo.png" style={styles.logoImg} />
            <View>
              <Text style={styles.brandTitle}>GUIDO <Text style={{ color: ACCENT }}>OPERUK</Text></Text>
              <Text style={styles.brandSubtitle}>Lic. en Nutrición · M.P. 778</Text>
            </View>
          </View>
          <View style={styles.headerMeta}>
            <Text style={styles.patientName}>{patientName}</Text>
            <Text style={styles.sessionInfo}>Fecha: {fechaStr} · Protocolo Clínico</Text>
          </View>
        </View>

        <View style={styles.docHeader}>
          <Text style={styles.docTitle}>Reporte de Evolución Nutricional</Text>
          <Text style={styles.docSub}>Análisis de composición corporal y metabolismo basal</Text>
        </View>

        {/* MÉTRIQUES BOLD */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCardDark}>
            <Text style={styles.metricLabelWhite}>Objetivo Diario</Text>
            <Text style={styles.metricValueWhite}>{Math.round(targetKcal || totalsDieta.kcal || 0)} <Text style={styles.metricUnit}>KCAL</Text></Text>
            <Text style={{ fontSize: 6, color: '#94a3b8', marginTop: 4, textTransform: 'uppercase' }}>{tipoObjetivo}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Gasto Energético (GET)</Text>
            <Text style={styles.metricValue}>{Math.round(resultadosMetabolicos.get || 0)} <Text style={styles.metricUnit}>KCAL</Text></Text>
            <Text style={{ fontSize: 6, color: SECONDARY, marginTop: 4 }}>TMB: {Math.round(resultadosMetabolicos.tmb || 0)} kcal</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Composición Corporal</Text>
            <Text style={styles.metricValue}>{fatPct > 0 ? fatPct.toFixed(1) : '-'} <Text style={styles.metricUnit}>% GRASA</Text></Text>
            <View style={styles.compBarContainer}>
                 <View style={[styles.barFat, { width: `${fatPct}%` }]} />
                 <View style={[styles.barMuscle, { width: `${musclePct}%` }]} />
                 <View style={[styles.barRemainder, { width: `${residualPct + bonePct}%` }]} />
            </View>
          </View>
        </View>

        {/* 1. ANAMNESIS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Perfil Clínico y Hábitos</Text>
          <View style={styles.dataGrid}>
             <View style={styles.dataBox}>
               <Text style={styles.dataLabel}>Motivo de Consulta</Text>
               <Text style={styles.dataValue}>{val(anamnesis.motivoConsulta)}</Text>
             </View>
             <View style={styles.dataBox}>
               <Text style={styles.dataLabel}>Ocupación / Horarios</Text>
               <Text style={styles.dataValue}>{val(anamnesis.ocupacion)} {anamnesis.horariosTrabajo ? `(${anamnesis.horariosTrabajo})` : ''}</Text>
             </View>
             <View style={styles.dataBox}>
               <Text style={styles.dataLabel}>Patologías y Antecedentes</Text>
               <Text style={styles.dataValue}>{val(anamnesis.patologias)}</Text>
             </View>
             <View style={styles.dataBox}>
               <Text style={styles.dataLabel}>Medicación / Suples</Text>
               <Text style={styles.dataValue}>{val(anamnesis.medicacionActual)} / {val(anamnesis.suplementacion)}</Text>
             </View>
             <View style={styles.dataBox}>
               <Text style={styles.dataLabel}>Actividad Física</Text>
               <Text style={styles.dataValue}>{val(anamnesis.nivelActividad)} - {anamnesis.frecuenciaEntrenamiento} sesiones/sem</Text>
             </View>
             <View style={styles.dataBox}>
               <Text style={styles.dataLabel}>Estilo de Vida</Text>
               <Text style={styles.dataValue}>Sueño: {val(anamnesis.horasSueno, 'h')} · Estrés: {val(anamnesis.nivelEstres, '/10')}</Text>
             </View>
          </View>
        </View>

        {/* 2. ANTROPOMETRIA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Biometría e Impedancia</Text>
          <View style={{ flexDirection: 'row', gap: 20 }}>
             <View style={{ flex: 1.2 }}>
                <View style={styles.bioRow}><Text style={[styles.bioCol, styles.bioLabel]}>Peso Corporal</Text><Text style={styles.bioCol}>{val(peso, ' kg')}</Text></View>
                <View style={styles.bioRow}><Text style={[styles.bioCol, styles.bioLabel]}>Altura</Text><Text style={styles.bioCol}>{val(mediciones.altura || anamnesis.altura, ' cm')}</Text></View>
                <View style={styles.bioRow}><Text style={[styles.bioCol, styles.bioLabel]}>IMC</Text><Text style={styles.bioCol}>{val(resultadosAntro.imc?.toFixed?.(1))}</Text></View>
                <View style={styles.bioRow}><Text style={[styles.bioCol, styles.bioLabel]}>Perímetro Cintura</Text><Text style={styles.bioCol}>{val(perimetros.cintura, ' cm')}</Text></View>
                <View style={styles.bioRow}><Text style={[styles.bioCol, styles.bioLabel]}>Perímetro Cadera</Text><Text style={styles.bioCol}>{val(perimetros.cadera, ' cm')}</Text></View>
             </View>
             <View style={{ flex: 1, backgroundColor: LIGHT_BG, padding: 10, borderRadius: 2 }}>
                <Text style={[styles.bioLabel, { marginBottom: 8, color: ACCENT }]}>PLIEGUES (mm)</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}><Text style={styles.bioText}>Tríceps</Text><Text style={[styles.bioText, { fontFamily: 'Helvetica-Bold' }]}>{val(pliegues.triceps)}</Text></View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}><Text style={styles.bioText}>Subescapular</Text><Text style={[styles.bioText, { fontFamily: 'Helvetica-Bold' }]}>{val(pliegues.subescapular)}</Text></View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}><Text style={styles.bioText}>Suprailiaco</Text><Text style={[styles.bioText, { fontFamily: 'Helvetica-Bold' }]}>{val(pliegues.suprailiaco)}</Text></View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}><Text style={styles.bioText}>Abdominal</Text><Text style={[styles.bioText, { fontFamily: 'Helvetica-Bold' }]}>{val(pliegues.abdominal)}</Text></View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}><Text style={styles.bioText}>Muslo</Text><Text style={[styles.bioText, { fontFamily: 'Helvetica-Bold' }]}>{val(pliegues.muslo)}</Text></View>
             </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>Lic. Guido Operuk · Ciencia y Resultados</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>

      {/* PÁGINA 2: PLAN NUTRICIONAL */}
      <Page size="A4" style={styles.page}>
         <View style={styles.header}>
            <View style={styles.logoSection}>
              <Image src="/logo.png" style={styles.logoImg} />
              <View>
                <Text style={styles.brandTitle}>PLAN <Text style={{ color: ACCENT }}>NUTRICIONAL</Text></Text>
                <Text style={styles.brandSubtitle}>Intervención Estratégica</Text>
              </View>
            </View>
            <View style={styles.headerMeta}>
               <Text style={styles.patientName}>{patientName}</Text>
               <Text style={styles.sessionInfo}>
                 Proteína: {Math.round(macrosObjetivo.proteinas)}g · 
                 HC: {Math.round(macrosObjetivo.carbohidratos)}g · 
                 Grasas: {Math.round(macrosObjetivo.grasas)}g
               </Text>
            </View>
         </View>

         <View style={styles.planHeader}>
            <View style={styles.planMacro}>
               <Text style={styles.planMacroVal}>{Math.round(totalsDieta.kcal || 0)}</Text>
               <Text style={styles.planMacroLabel}>Kcal Totales</Text>
            </View>
            <View style={styles.planMacro}>
               <Text style={[styles.planMacroVal, { color: ACCENT }]}>{Math.round(totalsDieta.p || 0)}g</Text>
               <Text style={styles.planMacroLabel}>Proteínas</Text>
            </View>
            <View style={styles.planMacro}>
               <Text style={styles.planMacroVal}>{Math.round(totalsDieta.c || 0)}g</Text>
               <Text style={styles.planMacroLabel}>Carbohidratos</Text>
            </View>
            <View style={styles.planMacro}>
               <Text style={styles.planMacroVal}>{Math.round(totalsDieta.g || 0)}g</Text>
               <Text style={styles.planMacroLabel}>Grasas</Text>
            </View>
         </View>

         {meals.length > 0 ? (
           <View style={{ marginTop: 10 }}>
              {meals.map((meal: any, idx: number) => (
                <View key={idx} style={styles.mealCard} wrap={false}>
                   <Text style={styles.mealTitle}>{meal.nombre?.toUpperCase() || `COMIDA ${idx + 1}`}</Text>
                   <View style={styles.mealContent}>
                      {meal.items?.map((it: any, j: number) => (
                        <View key={j} style={styles.foodItem}>
                           <Text style={styles.foodName}>{it.nombre}</Text>
                           <Text style={styles.foodQty}>{it.gramos}g</Text>
                           <Text style={styles.foodMacros}>{Math.round(it.calorias || 0)} kcal · {Math.round(it.proteinas || 0)}P/{Math.round(it.carbohidratos || 0)}C</Text>
                        </View>
                      ))}
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6 }}>
                         <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: ACCENT }}>
                            Subtotal: {Math.round(meal.items?.reduce((a:number, b:any)=>a+(b.calorias || 0), 0))} kcal
                         </Text>
                      </View>
                   </View>
                </View>
              ))}
           </View>
         ) : (
           <Text style={{ textAlign: 'center', color: SECONDARY, marginTop: 40, letterSpacing: 1 }}>PLAN NO ESPECIFICADO EN ESTA SESIÓN</Text>
         )}

         <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>Recomendaciones del Lic. Guido Operuk</Text>
            <Text style={styles.notesText}>
               1. Priorice la calidad de los alimentos, prefiriendo siempre opciones frescas y de temporada.{"\n"}
               2. Mantenga una hidratación constante (mínimo 2.5 litros de agua/día).{"\n"}
               3. No saltee comidas para asegurar el correcto aporte de macronutrientes al tejido muscular.{"\n"}
               4. El cumplimiento de este plan es fundamental para alcanzar el objetivo de {tipoObjetivo.toLowerCase()}.
            </Text>
         </View>

         <View style={styles.footer} fixed>
          <Text>Lic. Guido Operuk · guidonutricion.com</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};
