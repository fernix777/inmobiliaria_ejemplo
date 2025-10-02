-- Script para configurar Supabase Storage para imágenes de propiedades
-- Ejecutar este script en el SQL Editor de Supabase Dashboard

-- Crear bucket para imágenes de propiedades
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas RLS para el bucket
-- Política para permitir uploads por usuarios autenticados
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
