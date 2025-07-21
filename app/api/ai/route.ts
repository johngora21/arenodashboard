import { NextRequest, NextResponse } from 'next/server';
import aiService, { AIAnalysisRequest } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body: AIAnalysisRequest = await request.json();

    let result;

    switch (body.type) {
      case 'shipment_analysis':
        result = await aiService.analyzeShipmentData(body.data);
        break;
      
      case 'customer_support':
        result = await aiService.generateCustomerSupportResponse(
          body.data.query, 
          body.context
        );
        break;
      
      case 'report_generation':
        result = await aiService.generateReport(body.data, body.context || 'general');
        break;
      
      case 'route_optimization':
        result = await aiService.optimizeRoutes(body.data);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 