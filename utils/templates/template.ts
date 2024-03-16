export const templateConstance = `
<!DOCTYPE html>
<html lang="es">

<head>
    <base href="/utils/templates/">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Constancia de servicio</title>
    <style>
        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            font-family: Calibri;
            font-size: 10pt;
        }

        header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            height: 3cm;
            padding: 24px;
        }

        main {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .textContainer {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 100%;
        }
        h5{
            font-size: 8pt;
            font-weight: bold;
            text-align: center;
            padding: 16px;
        }
        h5,h6,h2,h3{
            font-style: italic;
        }
        span {
            font-weight: bold;
            font-size: 8pt;
        }
        h4{
            flex: 1;
            border-bottom: 1px solid black; /* Línea de subrayado */
            height: 42px;
            text-align: center;
            margin-left: 14px;
            vertical-align: bottom;
            font-size: 22pt;
            font-weight: normal;
        }
    </style>
</head>

<body style="width: 21cm;height: 29.7cm;">
    <header>
        <img src="./Logo Hospital San Juan de Dios -Original-.png" width="248px" height="auto" />
        <div style="display: flex; flex-direction: column; justify-content: flex-end; align-items: end;">
            <p style="font-size: 11pt; font-weight: bold;">GESTION TECNICA</p>
            <p style="font-size: 9pt; font-weight: bold;">Ardoino 714, Ramos Mejia - Tel: 4469-9500</p>
            <p style="font-size: 9pt; color: blue; text-decoration: underline; font-weight: bold;">
                www.sanjuandedios.org.ar</p>
        </div>
    </header>

    <div style="display: flex; ">
        <hr style="border: 5px solid #00b0f0;width: 15%;">
        <hr style="border: 5px solid #285182;width: 85%;">
    </div>

    <main>
        <h1 style="font-size: 12pt; padding-top: 32px; padding-bottom: 32px;">CONSTANCIA DE SERVICIO</h1>
        <h2 style="font-size: 14pt; font-weight: normal;">Se constata el servicio satisfactoriamente en un todo conforme
            a lo facturado</h2>
        <div style="display: flex;flex-direction: column; gap: 72px; align-items: start; width: 100%; padding-left: 80px; padding-right: 152px; padding-top: 42px;padding-bottom: 42px;">
            <div class="textContainer">
                <h3>Proveedor:</h3>
                <h4>{{provider}}</h4>
            </div>
            <div class="textContainer">
                <h3>Factura N°:</h3>
                <h4>{{invoiceNumber}}</h4>
            </div>
            <div style="display: flex; flex-direction: row; width: 100%; gap: 20px;">
                <div class="textContainer">
                    <h3>Fecha:</h3>
                    <h4>{{date}}</h4>
                </div>
                <div class="textContainer">
                    <h3>Importe:</h3>
                    <h4>{{amount}}</h4>
                </div>
            </div>
            <div class="textContainer">
                <h3>Concepto:</h3>
                <h4>{{concept}}</h4>
            </div>
        </div>
        <h5 >Se archiva toda documentación técnica auxiliar concerniente a este servicio (Certificado, manifiesto, entre
            otros)</h5>
        <h5>Este documento acredita que el servicio técnico facturado está realizado por la firma que se detalla en el
            cuerpo de la presente y constata la visita, pero no valida la correcta ejecución de la misma. Este
            formulario sustituye al remito a todo informe de asistencia que la empresa omite entregar como aval de
            culminación de su servicio.<br>
            Esta constancia también valida facturas de servicios prepagos aun no realizado.
        </h5>
        <div class="textContainer" style="width: auto;padding-top: 42px;">
            <h3 >Firma y Aclaracion: </h3>
            <div style="display: flex; flex-direction: column; margin-left: 14px; justify-content: flex-end;position: relative; height: 90px;  border-bottom: 1px solid black; ">
                <img src="./firmaJuan.png" alt="" height="160px" style="object-fit: contain;position: absolute;top: 50%; left: 50%;transform: translate(-50%, -50%);">
                <p style=" width: 300px; font-size: 10pt;text-align: center;">  Ing. Juan Pablo Sanchez </p>
            </div>
            
        </div>
        
    </main>
    <footer style="text-align: center; padding-top: 80px;">
        <h6 style="font-weight: normal; font-size: 8pt;"><span>GT-F-08</span> Revisión: 01 F.E: 25/07/2019 <span>Elaboró:</span> Analista GT <span>Revisó:</span>
            Coord. de Calidad <span>Aprobó: Líder GT</span></h6>
    </footer>
</body>

</html>
`

export const templateRequerimient = `
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>requerimiento</title>
    <style>
        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            font-family: Arial;
            font-size: 10pt;
            box-sizing: border-box;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        div {
            display: flex;
            align-items: center;
        }

        th,
        td {
            border: 1px solid black;
        }

        h1 {
            font-weight: normal;
        }

        h2 {
            font-weight: bold;
        }
        .left {
            text-align: left;
            padding-left: 5px;
        }
        h2,
        h1 {
            text-align: center;
            vertical-align: middle;
        }
        img {
            height: 106px; position: absolute; top: 0%; left: 50%; transform: translateX(-50%);
        }
    </style>
</head>

<body>
    <table style="width: 1494px;">
        <thead style="display: hide;">
            <tr>
                <th style="width: 46px;"></th>
                <th style="width: 63px;"></th>
                <th style="width: 149px;"></th>
                <th style="width: 89px;"></th>
                <th style="width: 21px;"></th>
                <th style="width: 24px;"></th>
                <th style="width: 24px;"></th>
                <th style="width: 24px;"></th>
                <th style="width: 31px;"></th>
                <th style="width: 24px;"></th>
                <th style="width: 24px;"></th>
                <th style="width: 24px;"></th>
                <th style="width: 24px;"></th>
                <th style="width: 24px;"></th>
                <th style="width: 24px;"></th>
                <th style="width: 48px;"></th>
                <th style="width: 42px;"></th>
                <th style="width: 42px;"></th>
                <th style="width: 42px;"></th>
                <th style="width: 42px;"></th>
                <th style="width: 152px;"></th>
                <th style="width: 152px;"></th>
                <th style="width: 185px;"></th>
                <th style="width: 174px;"></th>
            </tr>
        </thead>
        <tbody>
            <tr style="height: 39px;background-color: #BFBFBF;">
                <td colspan="2" style="border-right: 0px;">
                    <h1 style="font-size: 8pt">FECHA: </h1>
                </td>
                <td colspan="2" style="border-left: 0px;">
                    <h2 style="color: red;font-size: 9pt">{{createdAt}}</h2>
                </td>
                <td colspan="17">
                    <h2>FORMULARIO UNICO DE REQUERIMIENTO P/COMPRAS</h2>
                </td>
                <td colspan="1" style="border-right: 0px;">
                    <h1 class="left" style="font-size: 7pt;">NUMERO</h1>
                </td>
                <td colspan="2" style="border-left: 0px;">
                    <h2 style="font-size: 18pt;color: red">{{requerimientId}}</h2>
                </td>
            </tr>

            <tr style="height: 27px;">
                <td colspan="24"></td>
            </tr>

            <tr style="height: 27px;background-color: #F2F2F2;">
                <td colspan="3" style="border-right: 0px;">
                    <h1 class="left">Urgencia: Alto/Medio/Bajo</h1>
                </td>
                <td colspan="1" style="border-left: 0px;">
                    <h2 class="left" style="font-size: 18pt;color: red;">{{severity}}</h2> <!-- Variable -->
                </td>
                <td colspan="11" style="border-right: 0px;">
                    <h1  class="left">FECHA DE ENTREGA REQUERIDA: </h1>
                </td>
                <td colspan="6" style="border-left: 0px;">
                    <h1>{{expectedMonth}}</h1> <!-- Variable -->
                </td>
                <td colspan="1" style="border-right: 0px;">
                    <h2  class="left">ORIGINAL</h2>
                </td>
                <td colspan="2" style="border-left: 0px;">
                    <h2 style="color: red;">*</h2>
                </td>
            </tr>

            <tr style="height: 27px;background-color: #F2F2F2;">
                <td colspan="2">
                    <h1 class="left">SOLICITANTE</h1>
                </td>
                <td colspan="19">
                    <h1 class="left" style="color: red;">INGENIERIA</h1>
                </td>
                <td colspan="1">
                    <h2 class="left">REITERACION</h2>
                </td>
                <td colspan="2">
                </td>
            </tr>

            <tr style="height: 27px;background-color: #F2F2F2;">
                <td colspan="2">
                    <h1 class="left">DESTINO</h1>
                </td>
                <td colspan="19">
                    <h1 class="left" style="color: red;">{{service}}</h1> <!-- Variable -->
                </td>
                <td colspan="1">
                    <h2 class="left">PEDIDO #</h2>
                </td>
                <td colspan="2">
                </td>
            </tr>
            <tr style="height: 38px;background-color: #F2F2F2;">
                <td colspan="21">
                </td>
                <td colspan="3">
                    <h2 class="left">Solicitud de Ppto:</h2>
                </td>
            </tr>
            <tr style="height: 41px;background-color: #F2F2F2;">
                <td colspan="2" style="border-right: 0px;">
                    <h2 class="left">ENTREGAR A: </h2>
                </td>
                <td colspan="19" style="border-left: 0px;">
                    <h2 class="left">{{destination}}</h2> <!-- Variable -->
                </td>
                <td colspan="1" style="border-right: 0px;">
                    <h2 class="left">CONSULTAR A:</h2>
                </td>
                <td colspan="2" style="border-left: 0px;">
                    <h1>requerimientos.ingenieria@sanjuandedios.org.ar</h1> <!-- Variable -->
                </td>
            </tr>

            <tr style="height: 22px;background-color: #BFBFBF;">
                <td colspan="24">
                    <h2>JUSTIFICACION DE COMPRA</h2>
                </td>
            </tr>
            <tr style="height: 21px">
                <td colspan="24"></td>
            </tr>
            <tr style="height: 18px;background-color: #BFBFBF;">
                <td colspan="24">
                    <h2>PRODUCTO REQUERIDO</h2>
                </td>
            </tr>
            <tr style=" height: 36px;">
                <td colspan="1" ><h2>Item.<h2></td>
                <td colspan="1" ><h2>Cant.</h2></td>
                <td colspan="1" ><h2>Unidad</h2></td>
                <td colspan="18"><h2>Descripción</h2></td>
                <td colspan="1" ><h2>Marca</h2></td>
                <td colspan="1" ><h2>Modelo</h2></td>
                <td colspan="1" ><h2>Motivo del pedido</h2></td>
            </tr>
            {{listItems}}
            <tr style="height: 38px;">
                <td colspan="24"></td>
            </tr>
            <tr style="height: 40px;">
                <td colspan="24"><h1> * MOTIVO DEL PEDIDO: 1-CUBIERTO POR
                    GARANTIA 2-FALLA INTRINSECA 3-DESGASTE NATURAL 4-ROTURA POR MAL USO DEL OPERADOR 5-ROTURA POR
                    ACCIDENTE 6-FALLA DE SOFTWARE 7-POR DEFECTO DE INSTALACIONES 8-EXTRAVIO DE PARTES</h1></td>
            </tr>
            <tr style="height: 31px ;background-color: #BFBFBF">
                <td colspan="24" style="height: 31px;">
                    <h2 class="left"> {{comment}} </h2>
                </td>
            </tr>
            <tr style="height: 41px; background-color: #F2F2F2;">
                <th colspan="7">
                    <h1>SOLICITO: FIRMA Y ACLARACION</h1>
                </th>
                <th colspan="13">
                    <h1>AUTORIZÓ: FIRMA y ACLARACION</h1>
                </th>
                <th colspan="4">
                    <h1>RETIRA: FIRMA y ACLARACION</h1>
                </th>
            </tr>
            <tr style="height: 106px;vertical-align: bottom; background-color: #F2F2F2;">
                <th colspan="7" style="position: relative;">
                    <img src="./firma.png">
                    <h1>{{createdBy}}</h1>
                </th> <!-- Variable -->
                <th colspan="13" style="position: relative;">
                    <img src="./firmaJP.png">
                    <h1>Ing. Juan Pablo Sanchez</h1>
                </th>
                <th colspan="4"></th>
            </tr>
        </tbody>
    </table>
</body>

</html>
`
export const bodyItems = `
<tr style="height: 25px;"> <!-- Variable -->
<td colspan="1" ><h1> {{item}} </h1></td>
<td colspan="1" ><h1> {{quantity}} </h1></td>
<td colspan="1" ><h1> {{type}} </h1></td>
<td colspan="18"><h1> {{description}} </h1></td>
<td colspan="1" ><h1> {{brand}} </h1></td>
<td colspan="1" ><h1> {{model}} </h1></td>
<td colspan="1" ><h1> {{reason}} </h1></td>
</tr>
`