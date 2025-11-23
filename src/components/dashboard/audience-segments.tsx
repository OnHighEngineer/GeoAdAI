import type { AdPlan } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Badge } from '../ui/badge';

type AudienceSegmentsProps = {
  segments: AdPlan['audience_segments'];
};

export function AudienceSegments({ segments }: AudienceSegmentsProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight mb-4 font-headline">
        Audience Segments
      </h2>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
        {segments.map((segment, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="font-semibold text-lg">
              {segment.segment_name}
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <p className="text-muted-foreground">{segment.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Details</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>Age Range:</strong> {segment.age_range}
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {segment.interests.map((interest, i) => (
                      <Badge key={i} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Preferred Channels</h4>
                <div className="flex flex-wrap gap-2">
                  {segment.preferred_channels.map((channel, i) => (
                    <Badge key={i} variant="outline">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
