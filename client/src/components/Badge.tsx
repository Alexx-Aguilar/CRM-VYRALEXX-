import React from 'react';

interface BadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'sm' }) => {
  const getBadgeStyle = (statusStr: string) => {
    switch (statusStr?.toLowerCase()) {
      // Success states (Green #22C55E)
      case 'activo':
      case 'activa':
      case 'aprobada':
      case 'aprobado':
      case 'publicada':
      case 'publicado':
      case 'completada':
      case 'completado':
      case 'ganado':
      case 'firmado':
      case 'pagado':
      case 'disponible':
      case 'cliente activo':
        return 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30';

      // Violet / In Progress states (#A855F7 / #8B3DFF)
      case 'en ejecución':
      case 'en ejecucion':
      case 'en progreso':
      case 'en producción':
      case 'en produccion':
      case 'en negociación':
      case 'en negociacion':
      case 'negociación':
      case 'en revisión':
      case 'en revision':
      case 'propuesta enviada':
      case 'reunion programada':
      case 'en proyectos':
      case 'en pausa':
        return 'bg-[#A855F7]/15 text-[#A855F7] border-[#A855F7]/30';

      // Cyan / Info states (#22D3EE)
      case 'pendiente':
      case 'contactado':
      case 'nueva propuesta':
        return 'bg-[#22D3EE]/15 text-[#22D3EE] border-[#22D3EE]/30';

      // Purple / Planning states (#8B3DFF)
      case 'borrador':
      case 'planificación':
      case 'planificacion':
      case 'nuevo prospecto':
      case 'primer contacto':
      case 'prospecto':
      case 'por_hacer':
      case 'por hacer':
        return 'bg-[#8B3DFF]/15 text-[#A855F7] border-[#8B3DFF]/30';

      // Danger / Alert states (Fuchsia/Rose #EC4899 / #EF4444)
      case 'atrasado':
      case 'vencido':
      case 'cancelada':
      case 'cancelado':
      case 'rechazada':
      case 'perdido':
      case 'inactivo':
      case 'inactiva':
      case 'no disponible':
      case 'cliente inactivo':
        return 'bg-[#EC4899]/15 text-[#EC4899] border-[#EC4899]/30';

      default:
        return 'bg-[#252239] text-[#A1A1B5] border-white/10';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${getBadgeStyle(status)} ${sizeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-90" />
      {status}
    </span>
  );
};
