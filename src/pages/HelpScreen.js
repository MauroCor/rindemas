const HelpScreen = () => {
    return (
        <div className="min-h-screen py-6 px-4" style={{background:'#111827', color:'#F3F4F6'}}>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-center text-3xl font-extrabold text-white mb-4">
                    AYUDA
                </h1>
                <p className="italic text-center text-sm text-blue-300 mb-8">
                    - Fijo, Tarjeta y Ahorro -
                </p>

                <section className="rounded-lg p-6 mb-6 shadow-lg" style={{background:'#1F2937'}}>
                    <h2 className="text-center text-xl font-semibold text-blue-400 mb-4">
                        OBJETIVO
                    </h2>
                    <p className="text-gray-300">
                        Esta aplicación está diseñada para brindarte una visión clara y organizada de tus
                        finanzas en el corto, mediano y largo plazo. Su objetivo es ayudarte a analizar el
                        impacto de tus decisiones y a planificar estratégicamente, trazando un camino hacia
                        tus metas financieras.
                    </p>
                </section>

                <section className="rounded-lg p-6 mb-6 shadow-lg" style={{background:'#1F2937'}}>
                    <h2 className="text-center text-xl font-semibold text-blue-400 mb-4">
                        MODO DE USO
                    </h2>
                    <p className="text-gray-300 mb-4">
                        Inicia ingresando información relevante de tus finanzas: ingresos, egresos, compras
                        con tarjeta y ahorros. Cada sección de la aplicación está diseñada para ofrecerte
                        herramientas específicas que faciliten la gestión de tus recursos.
                    </p>
                </section>

                <section className="rounded-lg p-6 mb-6 shadow-lg" style={{background:'#1F2937'}}>
                    <h3 className="text-center text-lg font-bold text-blue-300 mb-4">
                        Balance
                    </h3>
                    <p className="text-gray-300 mb-4">
                        En esta sección, ves el balance mensual basado en tus ingresos y egresos recurrentes y el total de tarjeta del mes (como sección aparte).
                        Mostramos “Tarjeta” por fuera de egresos fijos para que puedas ver su detalle sin bloquear el egreso.
                    </p>

                    <h4 className="text-md font-semibold text-blue-200 mb-2">Ejemplos:</h4>
                    <ul className="list-disc list-inside text-gray-300 mb-4">
                        <li>Ingresos: salario mensual, pagos recurrentes.</li>
                        <li>Egresos: servicios básicos, compras habituales.</li>
                    </ul>

                    <h4 className="text-md font-semibold text-blue-200 mb-2">Recomendaciones:</h4>
                    <p className="text-gray-300 mb-4">
                        Si no conoces la fecha de finalización de un ingreso o egreso, regístralo sin "fecha hasta."
                        Esto los proyectará automáticamente durante un año, ayudándote a planificar con más claridad.
                    </p>
                    <p className="text-gray-300 mb-4">
                        Introduce montos mensuales. Si tienes valores diarios, quincenales o trimestrales, conviértelos a un total mensual.
                    </p>
                    <p className="text-gray-300">
                        Para montos variables, ingresa el "peor escenario": el valor más bajo para ingresos y el más alto para egresos.
                        Esto garantizará que tus proyecciones sean realistas y evitará sorpresas financieras.
                    </p>

                    <h4 className="text-md font-semibold text-blue-200 mb-2 mt-4">Aclaraciones:</h4>
                    <ul className="list-disc list-inside text-gray-300 mb-4">
                        <li>Al eliminar un registro, su historial se conserva. Por ejemplo, si eliminas "Gimnasio" de tus egresos a partir de febrero, el monto se mantendrá en los meses anteriores.</li>
                        <li>Si no defines una "fecha hasta" al crear o actualizar un registro, este se proyectará automáticamente por un año desde la modificación.</li>
                        <li>No es posible crear ingresos o egresos con nombres duplicados.</li>
                        <li>El total de tarjeta que aparece en los egresos no se puede eliminar, ya que se calcula automáticamente desde la sección de tarjetas.</li>
                    </ul>
                </section>

                <section className="rounded-lg p-6 mb-6 shadow-lg" style={{background:'#1F2937'}}>
                    <h3 className="text-center text-lg font-bold text-blue-300 mb-4">
                        Tarjeta (eliminada como pestaña)
                    </h3>
                    <p className="text-gray-300 mb-4">
                        El total mensual de tarjeta ahora se visualiza dentro de Balance, como bloque propio con su detalle desplegable.
                    </p>
                    <h4 className="text-md font-semibold text-blue-200 mb-2">Aclaraciones:</h4>
                    <ul className="list-disc list-inside text-gray-300 mb-4">
                        <li>El total mensual de tarjeta se suma automáticamente como un egreso fijo.</li>
                        <li>Los gastos con tarjeta eliminados no mantienen un historial.</li>
                    </ul>
                </section>

                <section className="rounded-lg p-6 mb-6 shadow-lg" style={{background:'#1F2937'}}>
                    <h3 className="text-center text-lg font-bold text-blue-300 mb-4">
                        Ahorro
                    </h3>
                    <p className="text-gray-300 mb-4">
                        En esta sección, puedes registrar y gestionar tus ahorros e inversiones, visualizando
                        sus rendimientos y fechas de vencimiento.
                    </p>
                    <h4 className="text-md font-semibold text-blue-200 mb-2">Ejemplos:</h4>
                    <ul className="list-disc list-inside text-gray-300 mb-4">
                        <li>Renta fija: plazos fijos, letras (interés simple).</li>
                        <li>Renta pasiva: staking de criptomonedas (interés compuesto).</li>
                        <li>Renta variable: holdeo de acciones, cedears, criptos (interés variable).</li>
                    </ul>

                    <h4 className="text-md font-semibold text-blue-200 mb-2 mt-4">Aclaraciones:</h4>
                    <p className="text-gray-300">Renta fija:</p>
                    <ul className="list-disc list-inside text-gray-300 mb-4">
                        <li>Debes ingresar un monto final, si lo desconoces, cálculalo por tu cuenta desde la TNA.</li>
                        <li>Eliminar un ahorro de renta fija no mantiene el historial.</li>
                        <li>La columna de porcentaje muestra la TNA calculada.</li>
                    </ul>

                    <p className="text-gray-300">Renta pasiva:</p>
                    <ul className="list-disc list-inside text-gray-300 mb-4">
                        <li>Debes ingresar la TNA o APY, si lo desconoces, deberás calcularlo por tu cuenta.</li>
                        <li>Eliminar un ahorro de renta pasiva mantiene el historial. Simula un STOP desde el mes seleccionado.</li>
                        <li>Puedes actualizar el monto y TNA cuantas veces quieras. No olvides tomar en cuenta los intereses ganados.</li>
                        <li>La columna de porcentaje muestra la TNA ingresada.</li>
                    </ul>

                    <p className="text-gray-300">Renta variable:</p>
                    <ul className="list-disc list-inside text-gray-300 mb-4">
                        <li>Debes ingresar el Ticker o Símbolo; si coincide, obtendrás el valor histórico y actual del mismo.</li>
                        <li>Eliminar un ahorro de renta variable mantiene el historial. Simula que vendiste el activo.</li>
                        <li>Puedes actualizar el monto y cantidad cuantas veces quieras, simulando ventas o compras del mismo activo.</li>
                        <li>La columna de porcentaje muestra el rendimiento calculado del activo en base al monto inicial invertido.</li>
                        <li>Al hacer clic en las referencias del gráfico, se tachan y sus datos se ocultan.</li>
                    </ul>
                </section>

                <section className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
                    <h3 className="text-center text-lg font-bold text-blue-300 mb-4">
                        Cotización del dólar
                    </h3>
                    <p className="text-gray-300">
                        Puedes ajustar la cotización que desees para simular su impacto en todas las secciones.
                    </p>
                    <p className="text-gray-300 mb-4">
                        Encontrarás la opción "Dólar" en el icono de usuario.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default HelpScreen;


