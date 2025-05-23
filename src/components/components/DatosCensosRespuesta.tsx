import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Circle, Image, FileText, MapPin, Building, Home } from 'lucide-react';

interface Opcion {
  id: number;
  pregunta_id: number;
  texto: string;
  valor: string;
  imagen_url: string | null;
  orden: number;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

interface Respuesta {
  id: number;
  carga_trabajo_toma_id: number;
  pregunta_id: number;
  opcion_id: number | null;
  respuesta_texto: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Pregunta {
  id: number;
  categoria_id: number;
  tipo: string;
  nombre_grupo: string | null;
  texto: string;
  es_requerida: number;
  orden: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  respuesta: Respuesta;
  opciones: Opcion[];
}

interface EncuestaRespuesta {
  success: boolean;
  data: Pregunta[];
  message: string;
}

interface DatosCensosRespuestaProps {
  encuestaRespuesta: EncuestaRespuesta | null;
}

const getIconForType = (tipo: string) => {
  switch (tipo) {
    case 'text':
      return <FileText className="h-4 w-4" />;
    case 'multiselect':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'boolean':
      return <Circle className="h-4 w-4" />;
    case 'imagen':
      return <Image className="h-4 w-4" />;
    case 'colonia':
      return <Building className="h-4 w-4" />;
    case 'calle':
      return <MapPin className="h-4 w-4" />;
    case 'giro':
      return <Home className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getTypeLabel = (tipo: string) => {
  const typeLabels: { [key: string]: string } = {
    text: 'Texto',
    multiselect: 'Selección múltiple',
    boolean: 'Verdadero/Falso',
    imagen: 'Imagen',
    colonia: 'Colonia',
    calle: 'Calle',
    giro: 'Giro'
  };
  return typeLabels[tipo] || tipo;
};

const groupPreguntasByCategory = (preguntas: Pregunta[]) => {
  const categorias: { [key: number]: { nombre: string; preguntas: Pregunta[] } } = {};
  
  preguntas.forEach(pregunta => {
    if (!categorias[pregunta.categoria_id]) {
      categorias[pregunta.categoria_id] = {
        nombre: getCategoryName(pregunta.categoria_id),
        preguntas: []
      };
    }
    categorias[pregunta.categoria_id].preguntas.push(pregunta);
  });
  
  return categorias;
};

const getCategoryName = (categoriaId: number) => {
  const categorias: { [key: number]: string } = {
    1: 'Información de Dirección',
    2: 'Información Comercial',
    3: 'Características del Predio',
    4: 'Información del Medidor',
    5: 'Información de la Toma'
  };
  return categorias[categoriaId] || `Categoría ${categoriaId}`;
};

const groupPreguntasByGroup = (preguntas: Pregunta[]) => {
  const grupos: { [key: string]: Pregunta[] } = {};
  
  preguntas.forEach(pregunta => {
    const groupKey = pregunta.nombre_grupo || 'general';
    if (!grupos[groupKey]) {
      grupos[groupKey] = [];
    }
    grupos[groupKey].push(pregunta);
  });
  
  return grupos;
};

export default function DatosCensosRespuesta({ encuestaRespuesta }: DatosCensosRespuestaProps) {
    if (!encuestaRespuesta || !encuestaRespuesta.success || !encuestaRespuesta.data.length) {
        return (
        <Card>
            <CardHeader>
            <CardTitle className="text-xl font-semibold">Respuesta Encuesta</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-gray-500">No hay respuestas disponibles</p>
            </CardContent>
        </Card>
        );
    }

    const categorias = groupPreguntasByCategory(encuestaRespuesta.data);

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-4 flex-shrink-0">Respuesta Encuesta</h2>
            
            {/* Contenedor con scroll */}
            <div className="flex-1 overflow-y-auto max-h-[70vh] space-y-6 pr-2">
                {Object.entries(categorias).map(([categoriaId, categoria]) => {
                    const grupos = groupPreguntasByGroup(categoria.preguntas);
                    
                    return (
                    <Card key={categoriaId} className="w-full">
                        <CardHeader>
                        <CardTitle className="text-lg font-semibold text-blue-700">
                            {categoria.nombre}
                        </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        {Object.entries(grupos).map(([grupoNombre, preguntas]) => (
                            <div key={grupoNombre} className="space-y-3">
                            {grupoNombre !== 'general' && (
                                <>
                                <h4 className="text-md font-medium text-gray-700 mt-4">
                                    {grupoNombre}
                                </h4>
                                <Separator />
                                </>
                            )}
                            
                            {preguntas
                                .sort((a, b) => a.orden - b.orden)
                                .map((pregunta) => (
                                <div key={pregunta.id} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-1">
                                        {getIconForType(pregunta.tipo)}
                                    </div>
                                    
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                        <h5 className="font-medium text-gray-900">
                                            {pregunta.texto}
                                        </h5>
                                        <Badge variant="outline" className="text-xs">
                                            {getTypeLabel(pregunta.tipo)}
                                        </Badge>
                                        {pregunta.es_requerida === 1 && (
                                            <Badge variant="destructive" className="text-xs">
                                            Requerida
                                            </Badge>
                                        )}
                                        </div>
                                        
                                        <div className="space-y-2">
                                        <div className="text-sm text-gray-600">
                                            <strong>Respuesta:</strong>
                                        </div>
                                        
                                        {pregunta.opciones.length > 0 ? (
                                            <div className="space-y-1">
                                            {pregunta.opciones
                                                .sort((a, b) => a.orden - b.orden)
                                                .map((opcion) => (
                                                <div
                                                    key={opcion.id}
                                                    className={`flex items-center gap-2 p-2 rounded ${
                                                    pregunta.respuesta.opcion_id === opcion.id
                                                        ? 'bg-blue-100 border border-blue-300'
                                                        : 'bg-white border border-gray-200'
                                                    }`}
                                                >
                                                    {pregunta.respuesta.opcion_id === opcion.id ? (
                                                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                                    ) : (
                                                    <Circle className="h-4 w-4 text-gray-400" />
                                                    )}
                                                    <span className={`text-sm ${
                                                    pregunta.respuesta.opcion_id === opcion.id
                                                        ? 'font-medium text-blue-900'
                                                        : 'text-gray-700'
                                                    }`}>
                                                    {opcion.texto}
                                                    </span>
                                                </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-white border border-gray-200 rounded p-3">
                                            <span className="text-sm text-gray-900">
                                                {pregunta.respuesta.respuesta_texto}
                                            </span>
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                        ))}
                        </CardContent>
                    </Card>
                    );
                })}
            </div>
        </div>
    );
}