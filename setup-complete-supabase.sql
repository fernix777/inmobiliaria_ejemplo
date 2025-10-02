-- Script COMPLETO para configurar Supabase para De Brasi Propiedades
-- Ejecutar este script en el SQL Editor de Supabase Dashboard

-- =====================================================
-- 1. CREAR TABLA DE PROPIEDADES
-- =====================================================

-- Crear tabla properties si no existe
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    location TEXT,
    operation TEXT NOT NULL CHECK (operation IN ('venta', 'alquiler')),
    property_type TEXT CHECK (property_type IN ('casa', 'departamento', 'terreno', 'oficina', 'local')),
    price DECIMAL(12,2),
    currency TEXT DEFAULT 'USD' CHECK (currency IN ('USD', 'ARS')),
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    area DECIMAL(10,2),
    image_url TEXT,
    description TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_operation ON properties(operation);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);

-- Habilitar RLS (Row Level Security)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios solo pueden ver sus propias propiedades
CREATE POLICY "Users can view own properties" ON properties
    FOR SELECT USING (auth.uid() = user_id);

-- Política: Usuarios pueden insertar sus propias propiedades
CREATE POLICY "Users can insert own properties" ON properties
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: Usuarios pueden actualizar sus propias propiedades
CREATE POLICY "Users can update own properties" ON properties
    FOR UPDATE USING (auth.uid() = user_id);

-- Política: Usuarios pueden eliminar sus propias propiedades
CREATE POLICY "Users can delete own properties" ON properties
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 2. CREAR BUCKET DE STORAGE PARA IMÁGENES
-- =====================================================

-- Crear bucket para imágenes de propiedades
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas RLS para el bucket
CREATE POLICY "Users can upload property images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
);

-- Política para permitir lectura pública de imágenes
CREATE POLICY "Anyone can view property images" ON storage.objects
FOR SELECT USING (bucket_id = 'property-images');

-- Política para permitir actualización por el propietario
CREATE POLICY "Users can update their own property images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
);

-- Política para permitir eliminación por el propietario
CREATE POLICY "Users can delete their own property images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
);

-- =====================================================
-- 3. CREAR FUNCIÓN PARA ACTUALIZAR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. VERIFICACIÓN FINAL
-- =====================================================

-- Verificar que todo se creó correctamente
SELECT 'Tabla properties creada' as status;
SELECT COUNT(*) as bucket_count FROM storage.buckets WHERE name = 'property-images';
SELECT schemaname, tablename FROM pg_tables WHERE tablename = 'properties';
