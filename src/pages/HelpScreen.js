import React, { useState } from 'react';

const HelpScreen = () => {
  const [openTips, setOpenTips] = useState(false);
  const [openBalance, setOpenBalance] = useState(false);
  const [openSaldos, setOpenSaldos] = useState(false);
  const [openAhorros, setOpenAhorros] = useState(false);
  return (
    <div className="min-h-screen py-6 px-4" style={{background:'#111827', color:'#F3F4F6'}}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-3xl font-extrabold text-white mb-6">Manual de uso</h1>

        {/* Propósito */}
        <section className="rounded-lg p-6 mb-6 shadow-lg" style={{background:'#1F2937'}}>
          <h2 className="text-center text-xl font-semibold mb-3" style={{color:'#16A085'}}>Rinde+</h2>
          <p className="text-gray-300 text-center">
            Rinde+ te ayuda a ordenar y conocerte financieramente. Proyecciones simples para mejores decisiones. 📈<br/>
          </p>
        </section>

        {/* Consejos iniciales (desplegable) */}
        <section className="rounded-lg mb-4 shadow-lg" style={{background:'#1F2937'}}>
          <button onClick={()=>setOpenTips(!openTips)} className="w-full flex items-center justify-center relative px-6 py-4">
            <h2 className="text-xl font-semibold text-center" style={{color:'#16A085'}}>General</h2>
            <span className="text-gray-300 text-sm absolute right-6">{openTips ? '▲' : '▼'}</span>
          </button>
          {openTips && (
            <div className="px-6 pb-6">
              <p className="text-gray-300 mb-4">
                🎯 Rinde+ tiene <span className="font-semibold">3 secciones principales</span>: <span className="font-semibold">Balance</span>, <span className="font-semibold">Saldos</span> y <span className="font-semibold">Ahorros</span>.
              </p>

              <p className="text-gray-300 mb-4">
                📅 Todas funcionan con un carrusel mensual que te permite navegar entre meses.
              </p>

              <p className="text-gray-300 mb-3">
                💡 En el <strong>carrusel</strong> podés seleccionar cualquier registro para ver su detalle y editarlo.
              </p>

              <p className="text-gray-300 mb-3">
                💱 Los importes en <span className="font-semibold">dólares</span> se convierten automáticamente con la cotización actual que indica el carrusel. Podés ajustar otra cotización desde <span className="font-semibold">Usuario → Dólar</span>.
              </p>

              <p className="text-gray-300 mb-4">
                🚀 <strong>Recomendación:</strong> Empezá agregando tus datos en <span className="font-semibold">Saldos</span> para tener una base sólida.
              </p>
            </div>
          )}
        </section>

        {/* Pestaña: Balance (desplegable) */}
        <section className="rounded-lg mb-4 shadow-lg" style={{background:'#1F2937'}}>
          <button onClick={()=>setOpenBalance(!openBalance)} className="w-full flex items-center justify-center relative px-6 py-4">
            <h2 className="text-xl font-semibold text-center" style={{color:'#16A085'}}>Balance</h2>
            <span className="text-gray-300 text-sm absolute right-6">{openBalance ? '▲' : '▼'}</span>
          </button>
          {openBalance && (
            <div className="px-6 pb-6">
              <p className="text-gray-300 mb-4">
                💳 <strong>Vista de tu billetera general</strong><br/>
                Te responde: <span className="font-semibold">¿Cuánto dinero tenés disponible cada mes?</span> Incluye tus rendimientos de ahorros. 💰
              </p>

              <p className="text-gray-300 mb-3">
                📊 <strong>¿Qué es el Balance?</strong> Es tu dinero disponible del mes: saldo mensual + ahorros líquidos. Todo en una sola vista.
              </p>
            </div>
          )}
        </section>

        {/* Pestaña: Saldos (desplegable) */}
        <section className="rounded-lg mb-4 shadow-lg" style={{background:'#1F2937'}}>
          <button onClick={()=>setOpenSaldos(!openSaldos)} className="w-full flex items-center justify-center relative px-6 py-4">
            <h2 className="text-xl font-semibold text-center" style={{color:'#16A085'}}>Saldos</h2>
            <span className="text-gray-300 text-sm absolute right-6">{openSaldos ? '▲' : '▼'}</span>
          </button>
          {openSaldos && (
            <div className="px-6 pb-6">
              <p className="text-gray-300 mb-4">
                💸 <strong>Gestioná tus ingresos y gastos mensuales</strong><br/>
                Te responde: <span className="font-semibold">¿Cuánto dinero queda de tus ingresos cada mes?</span> 📊
              </p>

              <p className="text-gray-300 mb-3">
                🎯 <strong>Consejos para proyectar:</strong>
              </p>

              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Agregá ingresos y egresos <span className="font-semibold">recurrentes</span> por al menos un año para proyectar mejor.</li>
                <li>Agrupá <span className="font-semibold">gastos hormiga</span> como un Gasto general.</li>
                <li>Para ingresos/egresos <span className="font-semibold">variables</span>, siempre es mejor subestimar ingresos y sobreestimar gastos para evitar sorpresas desagradables.</li>
              </ul>
            </div>
          )}
        </section>

        {/* Pestaña: Ahorros (desplegable) */}
        <section className="rounded-lg mb-4 shadow-lg" style={{background:'#1F2937'}}>
          <button onClick={()=>setOpenAhorros(!openAhorros)} className="w-full flex items-center justify-center relative px-6 py-4">
            <h2 className="text-xl font-semibold text-center" style={{color:'#16A085'}}>Ahorros</h2>
            <span className="text-gray-300 text-sm absolute right-6">{openAhorros ? '▲' : '▼'}</span>
          </button>
          {openAhorros && (
            <div className="px-6 pb-6">
              <p className="text-gray-300 mb-4">
                💎 <strong>Gestioná tus ahorros invertidos</strong><br/>
                Te responde: <span className="font-semibold">¿Cuánto crece y rinde mi cartera?</span> 📈
              </p>

              <p className="text-gray-300 mb-3">
                🏦 <strong>Tipos de inversión:</strong>
              </p>

              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li><span className="font-semibold">Renta fija:</span> Plazo fijo, bonos. Conocés el monto final desde el inicio.</li>
                <li><span className="font-semibold">Renta pasiva:</span> Billeteras virtuales, staking. Tenés el dinero disponible mientras genera rendimiento.</li>
                <li><span className="font-semibold">Renta variable:</span> Criptomonedas, acciones. El valor cambia según el mercado.</li>
              </ul>

              <p className="text-gray-300 mb-3">
                📊 <strong>¿Qué significan los montos?</strong>
              </p>

              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-3">
                <li><span className="font-semibold">Total:</span> Tus ahorros acumulados hasta el mes actual.</li>
                <li><span className="font-semibold">Disponible:</span> Dinero líquido que podés usar (no invertido + rentas rescatables).</li>
                <li><span className="font-semibold">No invertido:</span> Vencimientos del mes que aún no definiste. Te recuerda que tenés ese dinero sin generar rendimientos y que debés definir una inversión.</li>
              </ul>

              <p className="text-gray-300 mb-3">
                ✏️ <strong>Anotaciones:</strong>
              </p>

              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-3">
                <li><span className="font-semibold">Lápiz:</span> Agregá anotaciones (monto + nota) para restar lo que ya invertiste o gastaste del dinero no invertido.</li>
              </ul>

              <p className="text-gray-300 mb-3">
                🔄 <strong>Switch Proyectar:</strong> Actívalo para incluir inversiones vencidas que aún no reinvertiste. Se visualizará gráfico de Proyección del portafolio.
              </p>

              <p className="text-gray-300 mb-3">
                📈 <strong>Graficar Portafolio:</strong>
              </p>

              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-3">
                <li>¿Cuánto tendré y cuánto valdrá? Muestra la evolución de tu cartera en el tiempo contemplando la inflación y el dólar.</li>
                <li>Ajusta la inflación y suba del dólar anual para proyectar posibles escenarios.</li>
              </ul>

              <p className="text-gray-300 mb-3">
                📈 <strong>Graficar Rendimientos:</strong>
              </p>

              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Compara los rendimientos de tus inversiones contra la inflación. ¿Rinden por encima de la inflación?</li>
                <li>Conoce el rendimiento de tus Pesos vs. Dólares.</li>
                <li>Ajusta fecha desde y hasta a graficar.</li>
                <li>Elige en las referencias qué líneas graficar.</li>
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HelpScreen;


