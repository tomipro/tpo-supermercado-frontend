import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16 text-gray-700 text-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-10 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="font-bold mb-2 text-primary">NOSOTROS</div>
            <ul className="space-y-1">
              <li>Código de ética</li>
              <li>Alquileres en Locales</li>
              <li>Historia</li>
              <li>Trabajá con nosotros</li>
              <li>Responsabilidad Social</li>
              <li>G4 Pay</li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-2 text-primary">TIENDA ONLINE</div>
            <ul className="space-y-1">
              <li>Cyber Monday</li>
              <li>Hot Sale</li>
              <li>Cambios y Devoluciones</li>
              <li>Descuentos y Financiación</li>
              <li>Medios de Pago</li>
              <li>Métodos de Entrega</li>
              <li>Legales</li>
              <li>Ofertas y Catálogos</li>
              <li>Términos y Condiciones</li>
              <li>Política de Privacidad de Datos</li>
              <li>Venta Empresa</li>
              <li>Defensa del consumidor</li>
              <li>Ley de Defensa al Consumidor</li>
              <li>Decreto Reglamentario</li>
              <li>Dirección de Defensa al Consumidor</li>
              <li>Acuerdo ACYMA - Acción de Clase</li>
              <li>Libro de quejas online</li>
              <li>Datos Personales</li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-2 text-primary">AYUDA</div>
            <ul className="space-y-1">
              <li>Buscá tu Tienda</li>
              <li>Como comprar</li>
              <li>Contacto</li>
              <li>Limpiar sesión</li>
              <li>Preguntas Frecuentes</li>
              <li>Validación Biométrica</li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-2 text-primary">VISITÁ TAMBIÉN</div>
            <ul className="space-y-1">
              <li>G4 Almacenes</li>
              <li>G4 Kioscos</li>
              <li>G4 Ferreterias</li>
              <li>G4+</li>
              <li>G4 Prime</li>
            </ul>
            <div className="mt-4 font-bold text-primary">Seguinos</div>
            <div className="flex gap-2 mt-2">
              {/* Facebook */}
              <a href="#" aria-label="Facebook" className="bg-gray-200 rounded-full w-7 h-7 flex items-center justify-center text-lg hover:bg-blue-600 hover:text-white transition">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
                </svg>
              </a>
              {/* X (Twitter) */}
              <a href="#" aria-label="X" className="bg-gray-200 rounded-full w-7 h-7 flex items-center justify-center text-lg hover:bg-black hover:text-white transition">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  <path d="M17.53 2.47a.75.75 0 0 1 1.06 1.06l-5.47 5.47 5.47 5.47a.75.75 0 1 1-1.06 1.06l-5.47-5.47-5.47 5.47a.75.75 0 1 1-1.06-1.06l5.47-5.47-5.47-5.47A.75.75 0 1 1 6.53 2.47l5.47 5.47 5.47-5.47z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="bg-gray-200 rounded-full w-7 h-7 flex items-center justify-center text-lg hover:bg-gradient-to-tr hover:from-pink-500 hover:to-yellow-400 hover:text-white transition">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.516 2.567 5.784 2.296 7.15 2.234 8.416 2.176 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.13 4.659.387 3.678 1.368c-.98.98-1.237 2.092-1.295 3.373C2.013 5.668 2 6.077 2 12c0 5.923.013 6.332.072 7.612.058 1.281.315 2.393 1.295 3.373.98.98 2.092 1.237 3.373 1.295C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.058 2.393-.315 3.373-1.295.98-.98 1.237-2.092 1.295-3.373.059-1.28.072-1.689.072-7.612 0-5.923-.013-6.332-.072-7.612-.058-1.281-.315-2.393-1.295-3.373-.98-.98-2.092-1.237-3.373-1.295C15.668.013 15.259 0 12 0z"/>
                  <circle cx="12" cy="12" r="3.5"/>
                  <circle cx="18.406" cy="5.594" r="1.44"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" aria-label="YouTube" className="bg-gray-200 rounded-full w-7 h-7 flex items-center justify-center text-lg hover:bg-red-600 hover:text-white transition">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.425 3.5 12 3.5 12 3.5s-7.425 0-9.386.574A2.994 2.994 0 0 0 .502 6.186C0 8.147 0 12 0 12s0 3.853.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.575 20.5 12 20.5 12 20.5s7.425 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 15.853 24 12 24 12s0-3.853-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              {/* TikTok */}
              <a href="#" aria-label="TikTok" className="bg-gray-200 rounded-full w-7 h-7 flex items-center justify-center text-lg hover:bg-black hover:text-white transition">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  <path d="M12.75 2v12.25a2.25 2.25 0 1 1-2.25-2.25h-2A4.25 4.25 0 1 0 14.75 16.25V7.5h2.25A4.25 4.25 0 0 0 12.75 2z"/>
                </svg>
              </a>
            </div>
            <div className="mt-4 font-bold text-primary">Medios de pago</div>
            <div className="flex gap-2 mt-2">
              {/* Visa */}
              <span className="bg-gray-200 rounded w-10 h-6 flex items-center justify-center text-xs">
                <svg viewBox="0 0 32 12" width="32" height="12">
                  <text x="0" y="10" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="#1a1f71">VISA</text>
                </svg>
              </span>
              {/* Mastercard */}
              <span className="bg-gray-200 rounded w-10 h-6 flex items-center justify-center text-xs">
                <svg viewBox="0 0 32 12" width="32" height="12">
                  <circle cx="10" cy="6" r="5" fill="#eb001b"/>
                  <circle cx="22" cy="6" r="5" fill="#f79e1b"/>
                  <text x="5" y="11" fontFamily="Arial" fontWeight="bold" fontSize="7" fill="#fff">MC</text>
                </svg>
              </span>
              {/* Amex */}
              <span className="bg-gray-200 rounded w-10 h-6 flex items-center justify-center text-xs">
                <svg viewBox="0 0 32 12" width="32" height="12">
                  <rect width="32" height="12" rx="3" fill="#2e77bb"/>
                  <text x="16" y="9" fontFamily="Arial" fontWeight="bold" fontSize="8" fill="#fff" textAnchor="middle">AMEX</text>
                </svg>
              </span>
              {/* G4 Pay */}
              <span className="bg-gray-200 rounded w-10 h-6 flex items-center justify-center text-xs font-bold text-primary">
                G4 Pay
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="font-semibold text-gray-700 mb-1">Atención al cliente</div>
            <div>0810-999-58626</div>
            <div>0800-777-7777</div>
          </div>
          <div className="text-center text-xs text-gray-500">
            Copyright © 2025 Grupo 4 - TPO APIs<br />
            Términos y Condiciones | Seguridad y Privacidad | Código de ética
          </div>
        </div>
      </div>
    </footer>
  );
}
