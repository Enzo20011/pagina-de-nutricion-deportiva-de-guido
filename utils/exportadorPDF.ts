'use client';

/**
 * Utility to generate a professional A4 PDF for diet plans.
 * Uses html2pdf.js as per package.json
 */

export async function exportarPlanPDF(pacienteNombre: string, meals: any[], macros: any) {
  // We need to run this only on the client
  if (typeof window === 'undefined') return;
  
  // @ts-ignore
  const html2pdf = (await import('html2pdf.js')).default;

  const element = document.createElement('div');
  element.innerHTML = `
    <div style="font-family: 'Inter', Arial, sans-serif; padding: 40px; color: #0f172a; max-width: 850px; margin: auto; background: white;">
      <!-- HEADER ELITE -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #3b82f6; padding-bottom: 30px; margin-bottom: 40px;">
        <div style="display: flex; align-items: center; gap: 15px;">
           <div style="width: 50px; hieght: 50px; background: #0f172a; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-weight: 900; font-size: 24px;">G</div>
           <div>
             <h1 style="margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: -1px; font-weight: 900; italic: true;">Guido <span style="color: #3b82f6;">Nutrición</span></h1>
             <p style="margin: 2px 0 0; color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Sistema de Gestión Elite</p>
           </div>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; font-weight: 900; font-size: 14px; text-transform: uppercase;">Protocolo: ${pacienteNombre}</p>
          <p style="margin: 4px 0 0; color: #3b82f6; font-size: 11px; font-weight: bold;">Generado: ${new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <!-- DASHBOARD DE MACROS -->
      <div style="background: #f8fafc; padding: 30px; border-radius: 24px; margin-bottom: 40px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="margin: 0 0 8px; font-size: 10px; text-transform: uppercase; color: #64748b; letter-spacing: 2px;">Objetivo Diario</h2>
          <div style="font-size: 32px; font-weight: 900; color: #0f172a; letter-spacing: -1px;">${Math.round(macros.kcal)} <span style="font-size: 12px; color: #3b82f6; opacity: 0.5;">KCAL</span></div>
        </div>
        <div style="display: flex; gap: 30px;">
          <div style="text-align: center;">
            <div style="width: 35px; height: 35px; background: white; border-radius: 10px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 10px; color: #64748b; margin-bottom: 5px;">P</div>
            <strong style="font-size: 14px;">${Math.round(macros.p)}g</strong>
          </div>
          <div style="text-align: center;">
            <div style="width: 35px; height: 35px; background: #3b82f6; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 10px; color: white; margin-bottom: 5px;">C</div>
            <strong style="font-size: 14px;">${Math.round(macros.c)}g</strong>
          </div>
          <div style="text-align: center;">
            <div style="width: 35px; height: 35px; background: #94a3b8; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 10px; color: white; margin-bottom: 5px;">G</div>
            <strong style="font-size: 14px;">${Math.round(macros.g)}g</strong>
          </div>
        </div>
      </div>

      <!-- COMIDAS -->
      ${meals.map(meal => `
        <div style="margin-bottom: 40px; page-break-inside: avoid; break-inside: avoid;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
             <div style="width: 8px; height: 24px; background: #3b82f6; border-radius: 4px;"></div>
             <h3 style="text-transform: uppercase; font-size: 16px; font-weight: 900; color: #0f172a; margin: 0; italic: true;">${meal.nombre}</h3>
          </div>
          <table style="width: 100%; border-collapse: separate; border-spacing: 0 8px;">
            <thead>
              <tr style="text-align: left; font-size: 9px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px;">
                <th style="padding: 0 15px;">Alimento / Descripción</th>
                <th style="padding: 0 15px;">Porción</th>
                <th style="padding: 0 15px;">P / C / G</th>
                <th style="padding: 0 15px; text-align: right;">Energía</th>
              </tr>
            </thead>
            <tbody>
              ${meal.items.map((item: any) => `
                <tr style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
                  <td style="padding: 15px; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; border-left: 1px solid #f1f5f9; border-radius: 12px 0 0 12px; font-weight: bold; font-size: 12px; color: #334155;">${item.nombre}</td>
                  <td style="padding: 15px; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; font-size: 11px; color: #64748b;">${item.gramos}g</td>
                  <td style="padding: 15px; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; font-size: 11px; font-weight: bold; color: #94a3b8;">${item.proteinas} / ${item.carbos} / ${item.grasas}</td>
                  <td style="padding: 15px; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; border-radius: 0 12px 12px 0; text-align: right; font-weight: 900; font-size: 13px; color: #0f172a;">${Math.round((item.kcal * item.gramos) / 100)} <span style="font-size: 9px; color: #3b82f6;">KCAL</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `).join('')}

      <!-- FOOTER -->
      <div style="margin-top: 80px; padding: 40px; background: #0f172a; border-radius: 32px; color: white; text-align: center; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: #3b82f6; opacity: 0.1; border-radius: 50%; blur: 40px;"></div>
        <p style="margin: 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 3px; color: #3b82f6;">Guido Operuk</p>
        <p style="margin: 8px 0 0; font-size: 10px; color: #94a3b8; font-weight: 500;">Lic. en Nutrición | Especialista en Alto Rendimiento</p>
        <div style="margin-top: 20px; display: flex; justify-content: center; gap: 20px; font-size: 9px; color: white; opacity: 0.6; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
           <span>@guido.nutricion</span>
           <span>Posadas • Online</span>
        </div>
      </div>
    </div>
  `;

  const opt = {
    margin: 0,
    filename: `Plan_${pacienteNombre.replace(' ', '_')}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
  };

  html2pdf().from(element).set(opt).save();
}

export async function exportarConsultaCompletaPDF(paciente: any, data: any) {
  if (typeof window === 'undefined') return;
  // @ts-ignore
  const html2pdf = (await import('html2pdf.js')).default;
  const element = document.createElement('div');

  const an = data.anamnesis?.anamnesis || {};
  const antro = data.antropometria?.mediciones || {};
  const comp = data.antropometria || {};
  const meals = data.dieta?.meals || [];
  const macros = data.dieta?.totals || { kcal: 0, p: 0, c: 0, g: 0 };
  const pacienteNombre = `${paciente.nombre} ${paciente.apellido}`;

  element.innerHTML = `
    <div style="font-family: 'Inter', Arial, sans-serif; padding: 40px; color: #0f172a; max-width: 850px; margin: auto; background: white;">
      <!-- HEADER ELITE -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #3b82f6; padding-bottom: 30px; margin-bottom: 40px;">
        <div style="display: flex; align-items: center; gap: 15px;">
           <div style="width: 50px; height: 50px; background: #0f172a; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-weight: 900; font-size: 24px;">G</div>
           <div>
             <h1 style="margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: -1px; font-weight: 900; font-style: italic;">Guido <span style="color: #3b82f6;">Nutrición</span></h1>
             <p style="margin: 2px 0 0; color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Historia Clínica Integral</p>
           </div>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; font-weight: 900; font-size: 14px; text-transform: uppercase;">Paciente: ${pacienteNombre}</p>
          <p style="margin: 4px 0 0; color: #3b82f6; font-size: 11px; font-weight: bold;">Fecha: ${new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <!-- SECCION ANAMNESIS -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
         <h2 style="font-size: 16px; font-weight: 900; color: #3b82f6; text-transform: uppercase; margin-bottom: 15px;">1. Cuadro Clínico General</h2>
         <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
           <tr style="border-bottom: 1px solid #f1f5f9;">
             <td style="padding: 10px; font-weight: bold; width: 30%; color: #64748b; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Motivo Consulta</td>
             <td style="padding: 10px; font-weight: 600; color: #0f172a;">${an.motivoConsulta || 'No especificado'}</td>
           </tr>
           <tr style="border-bottom: 1px solid #f1f5f9;">
             <td style="padding: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Patologías y Alergias</td>
             <td style="padding: 10px; font-weight: 600; color: #0f172a;">${an.patologias || 'Ninguna'} / ${an.alergiasIntolerancias || 'Sin alergias'}</td>
           </tr>
           <tr style="border-bottom: 1px solid #f1f5f9;">
             <td style="padding: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Nivel de Actividad</td>
             <td style="padding: 10px; font-weight: 600; color: #0f172a;">${an.nivelActividad || 'Sensentariedad'} • Horas de sueño: ${an.horasSueno || '-'}</td>
           </tr>
         </table>
      </div>

      <!-- SECCION ANTROPOMETRIA -->
      <div style="margin-bottom: 40px; page-break-inside: avoid;">
         <h2 style="font-size: 16px; font-weight: 900; color: #3b82f6; text-transform: uppercase; margin-bottom: 15px;">2. Composición Corporal (Pliegues)</h2>
         <div style="display: flex; gap: 20px; text-align: center;">
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; flex: 1; border: 1px solid #e2e8f0;">
               <p style="margin: 0; font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Peso Base</p>
               <p style="margin: 5px 0 0; font-size: 22px; font-weight: 900; color: #0f172a;">${antro.peso || '-'} <span style="font-size:10px; color:#94a3b8;">kg</span></p>
            </div>
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; flex: 1; border: 1px solid #e2e8f0;">
               <p style="margin: 0; font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Densidad Grasa</p>
               <p style="margin: 5px 0 0; font-size: 22px; font-weight: 900; color: #0f172a;">${comp.grasaPct || '-'} <span style="font-size:10px; color:#94a3b8;">%</span></p>
            </div>
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; flex: 1; border: 1px solid #e2e8f0;">
               <p style="margin: 0; font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Masa Magra</p>
               <p style="margin: 5px 0 0; font-size: 22px; font-weight: 900; color: #0f172a;">${comp.masaMagraKg || '-'} <span style="font-size:10px; color:#94a3b8;">kg</span></p>
            </div>
         </div>
      </div>

      <!-- SECCION DIETA -->
      <h2 style="font-size: 16px; font-weight: 900; color: #3b82f6; text-transform: uppercase; margin-bottom: 15px;">3. Arquitectura Dietética</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 16px; margin-bottom: 30px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; page-break-inside: avoid;">
        <div>
          <h2 style="margin: 0 0 5px; font-size: 10px; text-transform: uppercase; color: #64748b; letter-spacing: 2px;">Impacto Energético Diario</h2>
          <div style="font-size: 28px; font-weight: 900; color: #0f172a; letter-spacing: -1px;">${Math.round(macros.kcal)} <span style="font-size: 12px; color: #3b82f6; opacity: 0.5;">KCAL</span></div>
        </div>
        <div style="display: flex; gap: 20px;">
          <div style="text-align: center;">
            <div style="width: 30px; height: 30px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 10px; color: #64748b; margin-bottom: 5px;">P</div>
            <strong style="font-size: 12px;">${Math.round(macros.p)}g</strong>
          </div>
          <div style="text-align: center;">
            <div style="width: 30px; height: 30px; background: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 10px; color: white; margin-bottom: 5px;">C</div>
            <strong style="font-size: 12px;">${Math.round(macros.c)}g</strong>
          </div>
          <div style="text-align: center;">
            <div style="width: 30px; height: 30px; background: #94a3b8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 10px; color: white; margin-bottom: 5px;">G</div>
            <strong style="font-size: 12px;">${Math.round(macros.g)}g</strong>
          </div>
        </div>
      </div>

      <!-- COMIDAS -->
      ${meals.map((meal: any) => meal.items.length > 0 ? `
        <div style="margin-bottom: 30px; page-break-inside: avoid;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
             <div style="width: 6px; height: 18px; background: #3b82f6; border-radius: 3px;"></div>
             <h3 style="text-transform: uppercase; font-size: 14px; font-weight: 900; color: #0f172a; margin: 0; font-style: italic;">${meal.nombre}</h3>
          </div>
          <table style="width: 100%; border-collapse: separate; border-spacing: 0 4px;">
            <thead>
              <tr style="text-align: left; font-size: 9px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
                <th style="padding: 0 10px;">Ingrediente</th>
                <th style="padding: 0 10px;">Cantidad</th>
                <th style="padding: 0 10px; text-align: right;">KCAL</th>
              </tr>
            </thead>
            <tbody>
              ${meal.items.map((item: any) => `
                <tr style="background: #ffffff; border: 1px solid #e2e8f0;">
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; font-size: 11px; color: #334155;">${item.nombre}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 10px; font-weight: bold; color: #3b82f6;">${item.gramos}g</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 900; font-size: 11px; color: #0f172a;">${Math.round((item.kcal * item.gramos) / 100)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : '').join('')}

      <!-- FOOTER -->
      <div style="margin-top: 60px; padding: 30px; background: #0f172a; border-radius: 20px; color: white; text-align: center; position: relative; overflow: hidden; page-break-inside: avoid;">
        <div style="position: absolute; top: 0; right: 0; width: 80px; height: 80px; background: #3b82f6; opacity: 0.1; border-radius: 50%; filter: blur(30px);"></div>
        <p style="margin: 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 3px; color: #3b82f6;">Guido Operuk</p>
        <p style="margin: 5px 0 0; font-size: 9px; color: #94a3b8; font-weight: 500;">Lic. en Nutrición Clínica y Deportiva</p>
      </div>
    </div>
  `;

  const opt = {
    margin: [0.3, 0, 0.3, 0],
    filename: `Sesion_Completa_${pacienteNombre.replace(' ', '_')}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' as const }
  };

  html2pdf().from(element).set(opt).save();
}
