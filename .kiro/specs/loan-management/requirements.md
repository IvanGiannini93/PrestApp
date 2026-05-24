# Requirements Document

## Introduction

PrestApp es una aplicación de gestión de préstamos diseñada para un prestamista individual. El sistema permite al administrador registrar clientes, crear préstamos, dar seguimiento a cuotas y generar reportes básicos de cobranza. Los clientes acceden a un portal seguro para consultar sus préstamos activos, cuotas pendientes e historial de préstamos. El sistema automatiza el cálculo de cuotas basándose en los parámetros del préstamo y envía recordatorios de fechas de vencimiento por correo electrónico o WhatsApp.

## Glossary

- **Sistema**: La aplicación de gestión de préstamos PrestApp en su totalidad
- **Portal_Admin**: La interfaz administrativa utilizada por el prestamista para gestionar clientes, préstamos y reportes
- **Portal_Cliente**: La interfaz web segura donde los clientes consultan su información de préstamos
- **Cliente**: Un prestatario registrado en el sistema con razón social, persona responsable e información de contacto
- **Préstamo**: Un acuerdo financiero con monto definido, plazo, frecuencia de pago y tasa de interés
- **Cuota**: Un pago individual programado dentro de un préstamo, con fecha de vencimiento y monto específicos
- **Frecuencia_Pago**: El intervalo entre cuotas, ya sea semanal o quincenal
- **Servicio_Recordatorio**: El subsistema responsable de enviar notificaciones de vencimiento por correo electrónico o WhatsApp
- **Servicio_Auth**: El subsistema de autenticación que gestiona el inicio de sesión con usuario/contraseña y la administración de tokens JWT
- **Reporte_Cobranza**: Una vista resumen que muestra las cuotas categorizadas como pagadas, pendientes o vencidas

## Requirements

### Requirement 1: Registro de Clientes

**User Story:** Como administrador, quiero registrar clientes con su información comercial, para poder asociar préstamos a ellos.

#### Acceptance Criteria

1. WHEN el administrador envía el formulario de registro de cliente, THE Portal_Admin SHALL crear un nuevo registro de Cliente con razón social (máximo 150 caracteres), nombre de persona responsable (máximo 100 caracteres), número de teléfono y correo electrónico
2. IF se envía un registro de cliente con campos obligatorios faltantes, THEN THE Portal_Admin SHALL mostrar un error de validación indicando qué campos faltan sin borrar los datos ya ingresados en el formulario
3. IF el administrador intenta registrar un cliente con una combinación de razón social y persona responsable que ya existe en el Sistema, THEN THE Portal_Admin SHALL rechazar el registro y mostrar un mensaje de error indicando que el cliente ya se encuentra registrado
4. WHEN un cliente se registra exitosamente, THE Portal_Admin SHALL mostrar un mensaje de confirmación con la razón social, nombre de persona responsable, número de teléfono y correo electrónico del cliente registrado

### Requirement 2: Creación de Préstamos

**User Story:** Como administrador, quiero crear préstamos para clientes registrados especificando monto, plazo, frecuencia e interés, para que el sistema pueda dar seguimiento al pago.

#### Acceptance Criteria

1. WHEN el administrador envía el formulario de creación de préstamo para un Cliente registrado, THE Portal_Admin SHALL crear un nuevo registro de Préstamo con monto (entre 1,000 y 10,000,000), plazo (entre 1 y 52 semanas), Frecuencia_Pago (semanal o quincenal), tasa de interés (entre 0.1% y 100% anual) y fecha de inicio del préstamo
2. WHEN se crea un préstamo, THE Sistema SHALL calcular automáticamente todos los montos de Cuota y fechas de vencimiento basándose en el monto del préstamo, plazo, Frecuencia_Pago y tasa de interés, generando el número de Cuotas correspondiente al plazo dividido entre la Frecuencia_Pago
3. IF se envía una creación de préstamo con monto fuera del rango permitido, plazo fuera del rango permitido, tasa de interés fuera del rango permitido, Frecuencia_Pago no reconocida, o fecha de inicio en el pasado, THEN THE Portal_Admin SHALL mostrar un error de validación indicando cada campo inválido y el rango o formato esperado
4. THE Portal_Admin SHALL restringir la creación de préstamos únicamente a clientes que ya estén registrados en el Sistema
5. WHEN un préstamo se crea exitosamente, THE Portal_Admin SHALL mostrar un mensaje de confirmación con el resumen del préstamo incluyendo el número de Cuotas generadas, monto de cada Cuota y fecha de vencimiento de la primera y última Cuota

### Requirement 3: Cálculo de Cuotas

**User Story:** Como administrador, quiero que el sistema calcule automáticamente las cuotas, para no tener que computar manualmente los calendarios de pago.

#### Acceptance Criteria

1. WHEN se crea un Préstamo con Frecuencia_Pago semanal, THE Sistema SHALL generar un número de registros de Cuota igual al plazo del préstamo dividido entre la frecuencia semanal, con fechas de vencimiento espaciadas siete días a partir de la fecha de inicio del préstamo
2. WHEN se crea un Préstamo con Frecuencia_Pago quincenal, THE Sistema SHALL generar un número de registros de Cuota igual al plazo del préstamo dividido entre la frecuencia quincenal, con fechas de vencimiento espaciadas catorce días a partir de la fecha de inicio del préstamo
3. THE Sistema SHALL distribuir el monto total de pago (capital más interés total) equitativamente entre todos los registros de Cuota, redondeando cada cuota a dos decimales y asignando la diferencia residual por redondeo a la última Cuota
4. THE Sistema SHALL calcular el interés total del préstamo multiplicando el monto del capital por la tasa de interés, y sumando el resultado al capital para obtener el monto total de pago
5. THE Sistema SHALL garantizar que la suma de los montos de todas las Cuotas generadas sea exactamente igual al monto total de pago (capital más interés total) del Préstamo
6. IF los parámetros del Préstamo producen un número de cuotas menor a uno, THEN THE Sistema SHALL rechazar la creación del préstamo e indicar un error de validación señalando que la combinación de plazo y frecuencia es inválida

### Requirement 4: Vista de Préstamos Activos y Cuotas Pendientes

**User Story:** Como administrador, quiero ver todos los préstamos activos y sus cuotas pendientes, para poder monitorear el portafolio de préstamos.

#### Acceptance Criteria

1. WHEN el administrador accede a la vista de préstamos activos, THE Portal_Admin SHALL mostrar una lista paginada de todos los Préstamos con estado activo, mostrando veinte registros por página e incluyendo nombre del cliente, monto del préstamo y saldo restante
2. WHEN el administrador selecciona un Préstamo específico, THE Portal_Admin SHALL mostrar todas las Cuotas no pagadas de ese Préstamo, incluyendo tanto las pendientes como las vencidas, con sus fechas de vencimiento y montos
3. THE Portal_Admin SHALL ordenar las Cuotas no pagadas por fecha de vencimiento en orden ascendente
4. IF no existen Préstamos con estado activo, THEN THE Portal_Admin SHALL mostrar un mensaje indicando que no hay préstamos activos en el portafolio

### Requirement 5: Reporte de Cobranza

**User Story:** Como administrador, quiero ver un reporte básico de cobranza, para entender el estado general de los pagos.

#### Acceptance Criteria

1. WHEN el administrador accede al reporte de cobranza, THE Portal_Admin SHALL mostrar las Cuotas de todos los Préstamos activos categorizadas como pagadas, pendientes o vencidas, usando la fecha actual como referencia para la clasificación
2. IF la fecha de vencimiento de una Cuota ha pasado respecto a la fecha actual y no se ha registrado ningún pago para esa Cuota, THEN THE Portal_Admin SHALL clasificar esa Cuota como vencida en el Reporte_Cobranza
3. IF una Cuota no tiene pago registrado y su fecha de vencimiento no ha pasado respecto a la fecha actual, THEN THE Portal_Admin SHALL clasificar esa Cuota como pendiente en el Reporte_Cobranza
4. THE Portal_Admin SHALL mostrar el monto total para cada categoría (pagadas, pendientes, vencidas) y la cantidad de Cuotas en cada categoría en el Reporte_Cobranza
5. IF no existen Cuotas en ninguna categoría al generar el Reporte_Cobranza, THEN THE Portal_Admin SHALL mostrar un mensaje indicando que no hay datos de cobranza disponibles

### Requirement 6: Acceso al Portal del Cliente

**User Story:** Como cliente, quiero acceder a un portal seguro con mis credenciales, para poder ver mi información de préstamos de forma privada.

#### Acceptance Criteria

1. WHEN un Cliente proporciona usuario y contraseña válidos, THE Servicio_Auth SHALL autenticar al Cliente y emitir un token JWT con una duración de expiración de 30 minutos, otorgando acceso al Portal_Cliente
2. WHEN un Cliente proporciona credenciales inválidas, THE Servicio_Auth SHALL denegar el acceso y mostrar un mensaje de error de autenticación sin revelar si el usuario o la contraseña es el dato incorrecto
3. WHILE un Cliente está autenticado, THE Portal_Cliente SHALL mostrar únicamente los préstamos activos, cuotas pendientes e historial de préstamos pertenecientes a ese Cliente específico, impidiendo el acceso a datos de otros Clientes
4. IF un token JWT expira, THEN THE Servicio_Auth SHALL requerir que el Cliente se re-autentique antes de acceder al Portal_Cliente
5. IF un Cliente acumula cinco intentos fallidos de autenticación consecutivos, THEN THE Servicio_Auth SHALL bloquear temporalmente el acceso a esa cuenta por un período de 15 minutos

### Requirement 7: Vista de Préstamo Activo del Cliente

**User Story:** Como cliente, quiero ver los detalles de mi préstamo activo, para entender mi obligación financiera actual.

#### Acceptance Criteria

1. WHEN un Cliente autenticado accede al Portal_Cliente, THE Portal_Cliente SHALL mostrar una lista de todos los Préstamos activos del Cliente, mostrando para cada uno: monto total, saldo restante, Frecuencia_Pago, tasa de interés, fecha de vencimiento de la próxima Cuota pendiente y monto de la próxima Cuota pendiente
2. IF el Cliente no tiene ningún Préstamo activo, THEN THE Portal_Cliente SHALL mostrar un mensaje indicando que no existen préstamos activos
3. WHEN un Cliente autenticado selecciona un Préstamo activo de la lista, THE Portal_Cliente SHALL mostrar el detalle completo de ese Préstamo incluyendo el número total de Cuotas, el número de Cuotas pagadas y el número de Cuotas pendientes

### Requirement 8: Vista de Cuotas Pendientes del Cliente

**User Story:** Como cliente, quiero ver mis cuotas pendientes con fechas y montos, para poder planificar mis pagos.

#### Acceptance Criteria

1. WHEN un Cliente autenticado consulta su Préstamo activo, THE Portal_Cliente SHALL mostrar una lista de todas las Cuotas pendientes con fechas de vencimiento y montos
2. THE Portal_Cliente SHALL ordenar las Cuotas pendientes por fecha de vencimiento en orden ascendente
3. THE Portal_Cliente SHALL mostrar cada Cuota con un indicador visual que distinga tres estados: vencida cuando la fecha de vencimiento ha pasado sin pago registrado, próxima a vencer cuando la fecha de vencimiento está dentro de los próximos tres días calendario, y pendiente para las demás Cuotas no pagadas con fecha de vencimiento posterior a tres días
4. IF el Cliente autenticado no tiene Cuotas pendientes en su Préstamo activo, THEN THE Portal_Cliente SHALL mostrar un mensaje indicando que no existen cuotas pendientes

### Requirement 9: Historial de Préstamos del Cliente

**User Story:** Como cliente, quiero ver mis préstamos anteriores, para poder revisar mi historial de crédito.

#### Acceptance Criteria

1. WHEN un Cliente autenticado accede a la sección de historial de préstamos, THE Portal_Cliente SHALL mostrar una lista de todos los Préstamos completados de ese Cliente con su monto original, plazo, tasa de interés, total de interés pagado y fecha de finalización
2. THE Portal_Cliente SHALL ordenar los Préstamos completados por fecha de finalización en orden descendente
3. IF el Cliente autenticado no tiene Préstamos completados, THEN THE Portal_Cliente SHALL mostrar un mensaje indicando que no existe historial de préstamos

### Requirement 10: Recordatorios de Fecha de Vencimiento

**User Story:** Como cliente, quiero recibir recordatorios antes de mis fechas de vencimiento de pago, para no perder pagos.

#### Acceptance Criteria

1. WHEN faltan veinticuatro horas para la fecha de vencimiento de una Cuota pendiente, THE Servicio_Recordatorio SHALL enviar una notificación al Cliente a través del canal de contacto registrado del Cliente (correo electrónico o WhatsApp)
2. THE Servicio_Recordatorio SHALL incluir el monto de la Cuota, fecha de vencimiento y saldo restante del préstamo en la notificación
3. IF la Cuota ya está marcada como pagada al momento de generar el recordatorio, THEN THE Servicio_Recordatorio SHALL omitir el envío de la notificación para esa Cuota
4. IF el Servicio_Recordatorio falla al entregar una notificación, THEN THE Sistema SHALL registrar la falla de entrega incluyendo identificador del Cliente, identificador de la Cuota y canal utilizado, y reintentar el envío un máximo de dos veces con un intervalo de treinta minutos entre reintentos
5. IF el Cliente no tiene información de contacto válida registrada, THEN THE Servicio_Recordatorio SHALL registrar la imposibilidad de envío para revisión del administrador sin generar reintentos

### Requirement 11: Autenticación del Administrador

**User Story:** Como administrador, quiero iniciar sesión de forma segura, para que solo personal autorizado pueda gestionar préstamos y clientes.

#### Acceptance Criteria

1. WHEN el administrador proporciona usuario y contraseña que coinciden con las credenciales registradas, THE Servicio_Auth SHALL autenticar al administrador y emitir un token JWT con rol de administrador, otorgando acceso al Portal_Admin con una expiración de sesión de 60 minutos
2. WHEN el administrador proporciona credenciales que no coinciden con las registradas, THE Servicio_Auth SHALL denegar el acceso y mostrar un mensaje de error genérico de autenticación sin revelar si el usuario o la contraseña es el dato incorrecto
3. IF el administrador falla la autenticación 5 veces consecutivas, THEN THE Servicio_Auth SHALL bloquear temporalmente el acceso a esa cuenta por 15 minutos antes de permitir nuevos intentos
4. THE Servicio_Auth SHALL incluir el rol (administrador o cliente) como atributo en el token JWT emitido, de modo que el Sistema pueda restringir el acceso a funcionalidades según el rol
5. IF un token JWT de administrador expira o no está presente en una solicitud al Portal_Admin, THEN THE Servicio_Auth SHALL denegar el acceso y redirigir al administrador a la pantalla de inicio de sesión para re-autenticación

### Requirement 12: Registro de Pagos

**User Story:** Como administrador, quiero registrar pagos contra cuotas, para que el sistema refleje el estado actual del préstamo con precisión.

#### Acceptance Criteria

1. WHEN el administrador registra un pago para una Cuota, THE Portal_Admin SHALL marcar esa Cuota como pagada, reducir el saldo restante del Préstamo por el monto de esa Cuota y mostrar un mensaje de confirmación con el nuevo saldo restante
2. WHEN se registra un pago, THE Sistema SHALL almacenar la fecha actual del sistema como fecha de pago y el monto correspondiente a la Cuota
3. IF el administrador intenta registrar un pago para una Cuota que ya está marcada como pagada, THEN THE Portal_Admin SHALL mostrar un mensaje de error indicando que la Cuota ya fue pagada e impedir la operación
4. WHEN todas las Cuotas de un Préstamo están marcadas como pagadas, THE Sistema SHALL actualizar el estado del Préstamo a completado
5. IF el administrador ingresa un monto de pago menor o igual a cero, THEN THE Portal_Admin SHALL mostrar un error de validación indicando que el monto debe ser mayor a cero e impedir el registro del pago


