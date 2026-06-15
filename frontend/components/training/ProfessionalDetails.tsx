'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import type { ProfessionalDetail } from '@/lib/types'

interface ProfessionalDetailsProps {
  details: ProfessionalDetail[]
}

export function ProfessionalDetails({ details }: ProfessionalDetailsProps) {
  return (
    <Accordion defaultValue={["details"]} className="bg-white rounded-xl shadow-sm">
      <AccordionItem value="details" className="border-0">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <span className="text-gray-700 font-medium">专业详情</span>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {details.map((detail, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm text-gray-500">{detail.label}</span>
                  <span className="text-lg font-semibold text-gray-800">
                    {typeof detail.numeric_value === 'number' ? detail.numeric_value.toFixed(1) : detail.numeric_value}
                    {detail.unit && <span className="text-xs text-gray-500 ml-1">{detail.unit}</span>}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{detail.description_text}</p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
