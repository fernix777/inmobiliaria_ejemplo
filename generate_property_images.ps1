# Script para generar imágenes SVG de propiedades

$propertyImages = @(
    @{
        FileName = "property3.svg"
        Content = @"
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <!-- Fondo -->
  <rect width="400" height="300" fill="#f0f0f0"/>
  
  <!-- Cielo -->
  <rect width="400" height="150" fill="#ADD8E6"/>
  
  <!-- Agua (río) -->
  <rect y="150" width="400" height="150" fill="#4682B4"/>
  
  <!-- Torre Barlovento -->
  <g>
    <!-- Estructura principal -->
    <rect x="120" y="50" width="160" height="200" fill="#DCDCDC" stroke="#A9A9A9" stroke-width="2"/>
    
    <!-- Ventanas (patrón de cuadrícula) -->
    <g fill="#B0C4DE">
      <!-- Columna 1 -->
      <rect x="140" y="70" width="20" height="15"/>
      <rect x="140" y="95" width="20" height="15"/>
      <rect x="140" y="120" width="20" height="15"/>
      <rect x="140" y="145" width="20" height="15"/>
      <rect x="140" y="170" width="20" height="15"/>
      <rect x="140" y="195" width="20" height="15"/>
      <rect x="140" y="220" width="20" height="15"/>
      
      <!-- Columna 2 -->
      <rect x="170" y="70" width="20" height="15"/>
      <rect x="170" y="95" width="20" height="15"/>
      <rect x="170" y="120" width="20" height="15"/>
      <rect x="170" y="145" width="20" height="15"/>
      <rect x="170" y="170" width="20" height="15"/>
      <rect x="170" y="195" width="20" height="15"/>
      <rect x="170" y="220" width="20" height="15"/>
      
      <!-- Columna 3 -->
      <rect x="200" y="70" width="20" height="15"/>
      <rect x="200" y="95" width="20" height="15"/>
      <rect x="200" y="120" width="20" height="15"/>
      <rect x="200" y="145" width="20" height="15"/>
      <rect x="200" y="170" width="20" height="15"/>
      <rect x="200" y="195" width="20" height="15"/>
      <rect x="200" y="220" width="20" height="15"/>
      
      <!-- Columna 4 -->
      <rect x="230" y="70" width="20" height="15"/>
      <rect x="230" y="95" width="20" height="15"/>
      <rect x="230" y="120" width="20" height="15"/>
      <rect x="230" y="145" width="20" height="15"/>
      <rect x="230" y="170" width="20" height="15"/>
      <rect x="230" y="195" width="20" height="15"/>
      <rect x="230" y="220" width="20" height="15"/>
    </g>
    
    <!-- Detalles arquitectónicos -->
    <rect x="120" y="40" width="160" height="10" fill="#A9A9A9"/>
    <rect x="110" y="50" width="10" height="200" fill="#A9A9A9"/>
    <rect x="280" y="50" width="10" height="200" fill="#A9A9A9"/>
  </g>
  
  <!-- Barcos en el agua -->
  <g>
    <path d="M50,200 L70,200 L60,210 Z" fill="#FFFFFF"/>
    <rect x="55" y="200" width="10" height="15" fill="#8B4513"/>
    
    <path d="M320,180 L350,180 L335,195 Z" fill="#FFFFFF"/>
    <rect x="330" y="180" width="10" height="20" fill="#8B4513"/>
  </g>
  
  <!-- Texto "Olivos" -->
  <text x="20" y="280" font-family="Arial, sans-serif" font-size="14" fill="#FFFFFF">Departamento en Olivos</text>
</svg>
"@
    },
    @{
        FileName = "property4.svg"
        Content = @"
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <!-- Fondo -->
  <rect width="400" height="300" fill="#f5f5f5"/>
  
  <!-- Cielo -->
  <rect width="400" height="100" fill="#87CEEB"/>
  
  <!-- Césped/Jardín -->
  <rect y="180" width="400" height="120" fill="#32CD32"/>
  
  <!-- Casa pequeña -->
  <g>
    <!-- Estructura principal -->
    <rect x="120" y="100" width="160" height="100" fill="#FAEBD7" stroke="#8B4513" stroke-width="2"/>
    
    <!-- Techo -->
    <polygon points="120,100 200,60 280,100" fill="#CD853F" stroke="#8B4513" stroke-width="2"/>
    
    <!-- Puerta -->
    <rect x="190" y="150" width="30" height="50" fill="#8B4513"/>
    <circle cx="200" cy="175" r="2" fill="#FFD700"/> <!-- Picaporte -->
    
    <!-- Ventanas -->
    <rect x="140" y="120" width="30" height="30" fill="#B0E0E6" stroke="#8B4513" stroke-width="2"/>
    <line x1="140" y1="135" x2="170" y2="135" stroke="#8B4513" stroke-width="2"/>
    <line x1="155" y1="120" x2="155" y2="150" stroke="#8B4513" stroke-width="2"/>
    
    <rect x="230" y="120" width="30" height="30" fill="#B0E0E6" stroke="#8B4513" stroke-width="2"/>
    <line x1="230" y1="135" x2="260" y2="135" stroke="#8B4513" stroke-width="2"/>
    <line x1="245" y1="120" x2="245" y2="150" stroke="#8B4513" stroke-width="2"/>
  </g>
  
  <!-- Camino hacia la casa -->
  <rect x="190" y="200" width="30" height="100" fill="#A9A9A9"/>
  
  <!-- Árboles y arbustos -->
  <g>
    <!-- Árbol izquierdo -->
    <rect x="80" y="150" width="10" height="30" fill="#8B4513"/>
    <circle cx="85" cy="130" r="20" fill="#228B22"/>
    
    <!-- Árbol derecho -->
    <rect x="310" y="150" width="10" height="30" fill="#8B4513"/>
    <circle cx="315" cy="130" r="20" fill="#228B22"/>
    
    <!-- Arbustos -->
    <circle cx="120" cy="190" r="10" fill="#006400"/>
    <circle cx="280" cy="190" r="10" fill="#006400"/>
    <circle cx="140" cy="200" r="8" fill="#006400"/>
    <circle cx="260" cy="200" r="8" fill="#006400"/>
  </g>
  
  <!-- Texto "Beccar" -->
  <text x="20" y="280" font-family="Arial, sans-serif" font-size="14" fill="#333">Casa en Beccar</text>
</svg>
"@
    },
    @{
        FileName = "property5.svg"
        Content = @"
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <!-- Fondo -->
  <rect width="400" height="300" fill="#f0f0f0"/>
  
  <!-- Cielo -->
  <rect width="400" height="120" fill="#87CEEB"/>
  
  <!-- Césped/Jardín -->
  <rect y="200" width="400" height="100" fill="#228B22"/>
  
  <!-- Mansión/Residencia importante -->
  <g>
    <!-- Estructura principal -->
    <rect x="80" y="80" width="240" height="140" fill="#F5F5DC" stroke="#8B4513" stroke-width="2"/>
    
    <!-- Techo -->
    <polygon points="80,80 200,40 320,80" fill="#8B4513" stroke="#5C3317" stroke-width="2"/>
    
    <!-- Columnas -->
    <rect x="100" y="120" width="10" height="100" fill="#DCDCDC"/>
    <rect x="150" y="120" width="10" height="100" fill="#DCDCDC"/>
    <rect x="240" y="120" width="10" height="100" fill="#DCDCDC"/>
    <rect x="290" y="120" width="10" height="100" fill="#DCDCDC"/>
    
    <!-- Puerta principal -->
    <rect x="180" y="150" width="40" height="70" fill="#8B4513"/>
    <circle cx="190" cy="185" r="3" fill="#FFD700"/> <!-- Picaporte -->
    
    <!-- Ventanas -->
    <rect x="120" y="100" width="30" height="40" fill="#B0E0E6" stroke="#8B4513" stroke-width="2"/>
    <line x1="120" y1="120" x2="150" y2="120" stroke="#8B4513" stroke-width="2"/>
    <line x1="135" y1="100" x2="135" y2="140" stroke="#8B4513" stroke-width="2"/>
    
    <rect x="250" y="100" width="30" height="40" fill="#B0E0E6" stroke="#8B4513" stroke-width="2"/>
    <line x1="250" y1="120" x2="280" y2="120" stroke="#8B4513" stroke-width="2"/>
    <line x1="265" y1="100" x2="265" y2="140" stroke="#8B4513" stroke-width="2"/>
  </g>
  
  <!-- Camino hacia la casa -->
  <rect x="180" y="220" width="40" height="80" fill="#A9A9A9"/>
  
  <!-- Árboles y paisajismo -->
  <g>
    <!-- Árbol izquierdo grande -->
    <rect x="40" y="150" width="15" height="50" fill="#8B4513"/>
    <circle cx="47" cy="120" r="30" fill="#006400"/>
    
    <!-- Árbol derecho grande -->
    <rect x="345" y="150" width="15" height="50" fill="#8B4513"/>
    <circle cx="352" cy="120" r="30" fill="#006400"/>
    
    <!-- Arbustos decorativos -->
    <circle cx="100" cy="210" r="10" fill="#006400"/>
    <circle cx="130" cy="210" r="10" fill="#006400"/>
    <circle cx="270" cy="210" r="10" fill="#006400"/>
    <circle cx="300" cy="210" r="10" fill="#006400"/>
  </g>
  
  <!-- Texto "Martínez" -->
  <text x="20" y="280" font-family="Arial, sans-serif" font-size="14" fill="#333">Casa en Martínez</text>
</svg>
"@
    },
    @{
        FileName = "property6.svg"
        Content = @"
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <!-- Fondo -->
  <rect width="400" height="300" fill="#f5f5f5"/>
  
  <!-- Cielo -->
  <rect width="400" height="150" fill="#87CEEB"/>
  
  <!-- Río/Agua -->
  <rect y="150" width="400" height="150" fill="#4682B4"/>
  
  <!-- Edificio de departamentos -->
  <g>
    <!-- Estructura principal -->
    <rect x="120" y="50" width="160" height="150" fill="#E0E0E0" stroke="#A9A9A9" stroke-width="2"/>
    
    <!-- Ventanas -->
    <g fill="#B0C4DE">
      <!-- Fila 1 -->
      <rect x="140" y="70" width="25" height="20"/>
      <rect x="180" y="70" width="25" height="20"/>
      <rect x="220" y="70" width="25" height="20"/>
      
      <!-- Fila 2 -->
      <rect x="140" y="100" width="25" height="20"/>
      <rect x="180" y="100" width="25" height="20"/>
      <rect x="220" y="100" width="25" height="20"/>
      
      <!-- Fila 3 -->
      <rect x="140" y="130" width="25" height="20"/>
      <rect x="180" y="130" width="25" height="20"/>
      <rect x="220" y="130" width="25" height="20"/>
    </g>
    
    <!-- Balcones con parrilla -->
    <g fill="none" stroke="#A9A9A9" stroke-width="1">
      <rect x="135" y="90" width="35" height="5"/>
      <rect x="175" y="90" width="35" height="5"/>
      <rect x="215" y="90" width="35" height="5"/>
      
      <rect x="135" y="120" width="35" height="5"/>
      <rect x="175" y="120" width="35" height="5"/>
      <rect x="215" y="120" width="35" height="5"/>
      
      <rect x="135" y="150" width="35" height="5"/>
      <rect x="175" y="150" width="35" height="5"/>
      <rect x="215" y="150" width="35" height="5"/>
    </g>
    
    <!-- Parrillas en los balcones (simplificadas) -->
    <g fill="#696969">
      <rect x="145" y="90" width="10" height="3"/>
      <rect x="185" y="90" width="10" height="3"/>
      <rect x="225" y="90" width="10" height="3"/>
      
      <rect x="145" y="120" width="10" height="3"/>
      <rect x="185" y="120" width="10" height="3"/>
      <rect x="225" y="120" width="10" height="3"/>
      
      <rect x="145" y="150" width="10" height="3"/>
      <rect x="185" y="150" width="10" height="3"/>
      <rect x="225" y="150" width="10" height="3"/>
    </g>
    
    <!-- Entrada -->
    <rect x="180" y="180" width="40" height="20" fill="#A9A9A9"/>
  </g>
  
  <!-- Muelle -->
  <rect x="180" y="200" width="40" height="50" fill="#8B4513"/>
  
  <!-- Barcos -->
  <g>
    <path d="M50,220 L80,220 L65,235 Z" fill="#FFFFFF"/>
    <rect x="62" y="220" width="6" height="15" fill="#8B4513"/>
    
    <path d="M320,200 L350,200 L335,220 Z" fill="#FFFFFF"/>
    <rect x="332" y="200" width="6" height="25" fill="#8B4513"/>
  </g>
  
  <!-- Texto "Tigre" -->
  <text x="20" y="280" font-family="Arial, sans-serif" font-size="14" fill="#FFFFFF">Departamento en Tigre</text>
</svg>
"@
    },
    @{
        FileName = "property7.svg"
        Content = @"
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <!-- Fondo -->
  <rect width="400" height="300" fill="#f0f0f0"/>
  
  <!-- Cielo -->
  <rect width="400" height="100" fill="#87CEEB"/>
  
  <!-- Césped/Jardín -->
  <rect y="200" width="400" height="100" fill="#32CD32"/>
  
  <!-- Casa tipo piso -->
  <g>
    <!-- Estructura principal -->
    <rect x="100" y="80" width="200" height="140" fill="#FAEBD7" stroke="#8B4513" stroke-width="2"/>
    
    <!-- Techo -->
    <polygon points="100,80 200,40 300,80" fill="#CD853F" stroke="#8B4513" stroke-width="2"/>
    
    <!-- Puerta -->
    <rect x="180" y="170" width="40" height="50" fill="#8B4513"/>
    <circle cx="190" cy="195" r="3" fill="#FFD700"/> <!-- Picaporte -->
    
    <!-- Ventanas grandes (estilo casa de alquiler temporario) -->
    <rect x="120" y="100" width="50" height="40" fill="#B0E0E6" stroke="#8B4513" stroke-width="2"/>
    <line x1="120" y1="120" x2="170" y2="120" stroke="#8B4513" stroke-width="2"/>
    <line x1="145" y1="100" x2="145" y2="140" stroke="#8B4513" stroke-width="2"/>
    
    <rect x="230" y="100" width="50" height="40" fill="#B0E0E6" stroke="#8B4513" stroke-width="2"/>
    <line x1="230" y1="120" x2="280" y2="120" stroke="#8B4513" stroke-width="2"/>
    <line x1="255" y1="100" x2="255" y2="140" stroke="#8B4513" stroke-width="2"/>
  </g>
  
  <!-- Camino hacia la casa -->
  <rect x="180" y="220" width="40" height="80" fill="#A9A9A9"/>
  
  <!-- Elementos de alquiler temporario -->
  <g>
    <!-- Parrilla -->
    <rect x="320" y="180" width="30" height="20" fill="#696969"/>
    <rect x="325" y="175" width="20" height="5" fill="#A9A9A9"/>
    
    <!-- Piscina pequeña -->
    <rect x="50" y="180" width="40" height="20" fill="#00BFFF"/>
    <rect x="50" y="180" width="40" height="20" fill="none" stroke="#A9A9A9" stroke-width="1"/>
  </g>
  
  <!-- Árboles y paisajismo -->
  <g>
    <!-- Árbol izquierdo -->
    <rect x="30" y="150" width="10" height="50" fill="#8B4513"/>
    <circle cx="35" cy="130" r="20" fill="#006400"/>
    
    <!-- Árbol derecho -->
    <rect x="360" y="150" width="10" height="50" fill="#8B4513"/>
    <circle cx="365" cy="130" r="20" fill="#006400"/>
  </g>
  
  <!-- Texto "Beccar" -->
  <text x="20" y="280" font-family="Arial, sans-serif" font-size="14" fill="#333">Casa en Beccar (Alquiler temporario)</text>
</svg>
"@
    },
    @{
        FileName = "property8.svg"
        Content = @"
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <!-- Fondo -->
  <rect width="400" height="300" fill="#f5f5f5"/>
  
  <!-- Cielo -->
  <rect width="400" height="150" fill="#87CEEB"/>
  
  <!-- Edificio con penthouse -->
  <g>
    <!-- Estructura principal -->
    <rect x="100" y="80" width="200" height="220" fill="#E8E8E8" stroke="#A9A9A9" stroke-width="2"/>
    
    <!-- Penthouse (último piso destacado) -->
    <rect x="120" y="80" width="160" height="40" fill="#DCDCDC" stroke="#A9A9A9" stroke-width="2"/>
    
    <!-- Ventanas del penthouse (más grandes) -->
    <rect x="130" y="85" width="40" height="30" fill="#B0C4DE"/>
    <rect x="180" y="85" width="40" height="30" fill="#B0C4DE"/>
    <rect x="230" y="85" width="40" height="30" fill="#B0C4DE"/>
    
    <!-- Terraza del penthouse -->
    <rect x="120" y="120" width="160" height="10" fill="#A9A9A9"/>
    
    <!-- Ventanas del edificio -->
    <g fill="#B0C4DE">
      <!-- Fila 1 -->
      <rect x="120" y="140" width="25" height="20"/>
      <rect x="155" y="140" width="25" height="20"/>
      <rect x="190" y="140" width="25" height="20"/>
      <rect x="225" y="140" width="25" height="20"/>
      <rect x="260" y="140" width="25" height="20"/>
      
      <!-- Fila 2 -->
      <rect x="120" y="170" width="25" height="20"/>
      <rect x="155" y="170" width="25" height="20"/>
      <rect x="190" y="170" width="25" height="20"/>
      <rect x="225" y="170" width="25" height="20"/>
      <rect x="260" y="170" width="25" height="20"/>
      
      <!-- Fila 3 -->
      <rect x="120" y="200" width="25" height="20"/>
      <rect x="155" y="200" width="25" height="20"/>
      <rect x="190" y="200" width="25" height="20"/>
      <rect x="225" y="200" width="25" height="20"/>
      <rect x="260" y="200" width="25" height="20"/>
      
      <!-- Fila 4 -->
      <rect x="120" y="230" width="25" height="20"/>
      <rect x="155" y="230" width="25" height="20"/>
      <rect x="190" y="230" width="25" height="20"/>
      <rect x="225" y="230" width="25" height="20"/>
      <rect x="260" y="230" width="25" height="20"/>
    </g>
    
    <!-- Entrada -->
    <rect x="180" y="270" width="40" height="30" fill="#A9A9A9"/>
  </g>
  
  <!-- Detalles urbanos -->
  <g>
    <!-- Acera -->
    <rect y="290" width="400" height="10" fill="#A9A9A9"/>
    
    <!-- Farolas -->
    <rect x="50" y="250" width="5" height="40" fill="#696969"/>
    <circle cx="52" cy="250" r="5" fill="#FFFF00"/>
    
    <rect x="350" y="250" width="5" height="40" fill="#696969"/>
    <circle cx="352" cy="250" r="5" fill="#FFFF00"/>
  </g>
  
  <!-- Texto "Martínez" -->
  <text x="20" y="280" font-family="Arial, sans-serif" font-size="14" fill="#333">Penthouse en Martínez</text>
</svg>
"@
    }
)

# Crear directorio de imágenes si no existe
$imagesDir = "images/properties"
if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null
}

# Generar cada archivo SVG
foreach ($image in $propertyImages) {
    $filePath = Join-Path $imagesDir $image.FileName
    $image.Content | Out-File -FilePath $filePath -Encoding utf8
    Write-Host "Creado: $filePath"
}

Write-Host "Todas las imágenes de propiedades han sido generadas."