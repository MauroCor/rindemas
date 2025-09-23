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
          <h2 className="text-center text-xl font-semibold text-blue-400 mb-3">Rinde+</h2>
          <p className="text-gray-300">
            Este sistema es tu mejor asistente para entender cómo evolucionan tus finanzas personales en el tiempo. Prioriza la claridad por sobre la complejidad: muestra ingresos, egresos y ahorros mensuales con proyecciones que ayudan a razonar decisiones.
          </p>
        </section>

        {/* Consejos iniciales (desplegable) */}
        <section className="rounded-lg mb-4 shadow-lg" style={{background:'#1F2937'}}>
          <button onClick={()=>setOpenTips(!openTips)} className="w-full flex items-center justify-center relative px-6 py-4">
            <h2 className="text-xl font-semibold text-blue-400 text-center">Consejos iniciales</h2>
            <span className="text-gray-300 text-sm absolute right-6">{openTips ? '▲' : '▼'}</span>
          </button>
          {openTips && (
            <div className="px-6 pb-6">
              <p className="text-gray-300 mb-3">En <span className="font-semibold">Saldos</span> verás tarjetas por mes. La barra superior te ayuda a moverte y a enfocarte en el mes actual.</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-3">
                <li><span className="font-semibold">Navegar meses</span> (Saldos): usá las flechas para ir y venir.</li>
                <li><span className="font-semibold">Volver al presente</span> (Saldos): tocá <span className="font-semibold">Actual</span>. Se ve verde cuando no estás viendo el mes actual.</li>
                <li><span className="font-semibold">Ver más/menos meses</span> (Saldos): elegí 1 · 3 · 5 según necesites comparar.</li>
                <li><span className="font-semibold">Leer el detalle</span>: abrí y cerrá las filas; no modifican nada.</li>
                <li><span className="font-semibold">Cotización del dólar</span>: cambiá el valor desde <span className="font-semibold">Usuario » Dólar</span>. Afecta todas las pantallas por igual.</li>
              </ul>
            </div>
          )}
        </section>

        {/* Pestaña: Balance (desplegable) */}
        <section className="rounded-lg mb-4 shadow-lg" style={{background:'#1F2937'}}>
          <button onClick={()=>setOpenBalance(!openBalance)} className="w-full flex items-center justify-center relative px-6 py-4">
            <h2 className="text-xl font-semibold text-blue-400 text-center">Pestaña: Balance</h2>
            <span className="text-gray-300 text-sm absolute right-6">{openBalance ? '▲' : '▼'}</span>
          </button>
          {openBalance && (
            <div className="px-6 pb-6">
              <p className="text-gray-300 mb-4">Consultá tu <span className="font-semibold">billetera general</span>. Te responde: <span className="font-semibold">¿Cuánto dinero tenés disponible este u otro mes?</span> contemplando los <span className="font-semibold">rendimientos de tus ahorros</span>.</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>El <span className="font-semibold">Balance</span> es tu <span className="font-semibold">dinero disponible del mes</span>, conformado por el saldo mensual (ingresos-egresos) + tu liquidez mensual (ahorros dispoibles).</li>
                <li>En una tarjeta mensual podés <span className="font-semibold">ver el detalle de los montos</span> haciendo click.</li>
                <li>Para editar usá las pestañas <span className="font-semibold">Saldos</span> o <span className="font-semibold">Ahorros</span>.</li>
              </ul>
            </div>
          )}
        </section>

        {/* Pestaña: Saldos (desplegable) */}
        <section className="rounded-lg mb-4 shadow-lg" style={{background:'#1F2937'}}>
          <button onClick={()=>setOpenSaldos(!openSaldos)} className="w-full flex items-center justify-center relative px-6 py-4">
            <h2 className="text-xl font-semibold text-blue-400 text-center">Pestaña: Saldos</h2>
            <span className="text-gray-300 text-sm absolute right-6">{openSaldos ? '▲' : '▼'}</span>
          </button>
          {openSaldos && (
            <div className="px-6 pb-6">
              <p className="text-gray-300 mb-4">Gestioná tus <span className="font-semibold">ingresos y gastos mensuales</span>. Te responde: <span className="font-semibold">¿Cuánto dinero queda de tus ingresos este u otro mes?</span></p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Para que puedas <span className="font-semibold">proyectar a futuro</span>, agregá tus ingresos y egresos <span className="font-semibold">recurrentes</span> hasta, por lo menos, un año.</li>
                <li>Se aconseja <span className="font-semibold">agrupar gastos hormiga del mes</span> como: 'Gastos generales', para no estresarte registrando, hasta por ejemplo, la compra de una golosina.</li>
                <li>Si tenés un <span className="font-semibold">ingreso o egreso variable</span>, se recomienda proyectar el peor escenario. Preferible es tener más dinero del especulado, que lo contrario.</li>
                <li>Los <span className="font-semibold">ingresos y egresos</span> se eliminan desde el mes seleccionado en adelante, pero no hacia el pasado. Por ejemplo, al anular una subscripción.</li>
                <li>Los <span className="font-semibold">gastos con tarjeta</span> se eliminan desde su mes incial. Por ejemplo, si se registró mal el nombre: eliminar y recrear.</li>
                <li>Los importes están en pesos, los montos en <span className="font-semibold">dólares</span> se convierten automáticamente con la cotización vigente.</li>
              </ul>
            </div>
          )}
        </section>

        {/* Pestaña: Ahorros (desplegable) */}
        <section className="rounded-lg mb-4 shadow-lg" style={{background:'#1F2937'}}>
          <button onClick={()=>setOpenAhorros(!openAhorros)} className="w-full flex items-center justify-center relative px-6 py-4">
            <h2 className="text-xl font-semibold text-blue-400 text-center">Pestaña: Ahorros</h2>
            <span className="text-gray-300 text-sm absolute right-6">{openAhorros ? '▲' : '▼'}</span>
          </button>
          {openAhorros && (
            <div className="px-6 pb-6">
              <p className="text-gray-300 mb-4">Gestioná tus <span className="font-semibold">ahorros invertidos</span>. Te responde: <span className="font-semibold">¿Cuánto rinden mis ahorros? Proyectá tu evolución.</span></p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Un ejemplo de <span className="font-semibold">renta fija</span> es el plazo fijo en un banco. Para registrarlo debes conocer el monto final que obtendrás.</li>
                <li>Un ejemplo de <span className="font-semibold">renta pasiva</span> es mantener el dinero en una billetera virtual o el staking de criptomonedas. Contás con ese dinero mientras te genera un pequeño rendimiento.</li>
                <li>Un ejemplo de <span className="font-semibold">renta variable</span> es una criptomoneda o acciones en el mercado. Periodicamente el sistema consulta por el Ticker para conocer su valor.</li>
                <li>La opción de <span className="font-semibold">eliminar</span> para <span className="font-semibold">renta fija</span>, borra la inversión desde su fecha inicial.</li>
                <li>La opción de <span className="font-semibold">eliminar</span> para <span className="font-semibold">renta pasiva</span> y <span className="font-semibold">renta variable</span>, borra la inversión desde su mes seleccionado en adelante, simulando una venta.</li>
                <li>El monto <span className="font-semibold">Total</span> muestra tus ahorros acumulados hasta el mes en vista.</li>
                <li>El <span className="font-semibold">Modo proyección</span> suma las inversiones vencidas que aún no reinvertiste.</li>
                <li>El monto <span className="font-semibold">Disponible</span> es el dinero líquido del mes. Contempla lo que <span className="font-semibold">no esta invertido</span> y las <span className="font-semibold">rentas fijas o variables</span> que podés rescatar.</li>
                <li>El monto <span className="font-semibold">No invertido</span> son los vencimientos del mes que todavía no definiste. Podés agregar <span className="font-semibold">anotaciones</span> (monto + nota) para restar lo que ya invertiste o gastaste.</li>
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HelpScreen;


