import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIAnalysisRequest {
  type: 'shipment_analysis' | 'customer_support' | 'report_generation' | 'route_optimization';
  data: any;
  context?: string;
}

export interface AIAnalysisResponse {
  success: boolean;
  result: string;
  suggestions?: string[];
  error?: string;
}

export class AIService {
  private static instance: AIService;
  
  private constructor() {}
  
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Analyze shipment data and provide insights
   */
  async analyzeShipmentData(shipmentData: any): Promise<AIAnalysisResponse> {
    try {
      const prompt = `
        You are an AI logistics expert for Areno Logistics. Analyze the following shipment data and provide insights:
        
        Shipment Data: ${JSON.stringify(shipmentData, null, 2)}
        
        Please provide:
        1. Key performance indicators
        2. Potential issues or delays
        3. Optimization suggestions
        4. Cost analysis
        5. Customer satisfaction insights
        
        Format your response as a structured analysis with clear sections.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert logistics analyst specializing in shipment optimization and customer service."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      });

      return {
        success: true,
        result: completion.choices[0].message.content || 'No analysis available',
        suggestions: this.extractSuggestions(completion.choices[0].message.content || '')
      };
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return {
        success: false,
        error: 'Failed to analyze shipment data',
        result: ''
      };
    }
  }

  /**
   * Generate customer support responses
   */
  async generateCustomerSupportResponse(query: string, context?: any): Promise<AIAnalysisResponse> {
    try {
      const prompt = `
        You are a customer support representative for Areno Logistics. 
        Customer Query: "${query}"
        Context: ${context ? JSON.stringify(context) : 'No additional context'}
        
        Provide a helpful, professional response that:
        1. Addresses the customer's concern
        2. Offers solutions or alternatives
        3. Maintains a positive tone
        4. Includes relevant information about our services
        
        Keep the response concise but comprehensive.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional customer support representative for Areno Logistics, a logistics and transportation company."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return {
        success: true,
        result: completion.choices[0].message.content || 'Unable to generate response'
      };
    } catch (error) {
      console.error('AI Support Error:', error);
      return {
        success: false,
        error: 'Failed to generate support response',
        result: ''
      };
    }
  }

  /**
   * Generate detailed reports based on data
   */
  async generateReport(data: any, reportType: string): Promise<AIAnalysisResponse> {
    try {
      const prompt = `
        Generate a professional ${reportType} report for Areno Logistics based on the following data:
        
        Data: ${JSON.stringify(data, null, 2)}
        
        The report should include:
        1. Executive Summary
        2. Key Findings
        3. Performance Metrics
        4. Recommendations
        5. Action Items
        
        Format the report professionally with clear sections and bullet points where appropriate.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a business analyst specializing in logistics and transportation reporting."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.4,
      });

      return {
        success: true,
        result: completion.choices[0].message.content || 'Unable to generate report'
      };
    } catch (error) {
      console.error('AI Report Generation Error:', error);
      return {
        success: false,
        error: 'Failed to generate report',
        result: ''
      };
    }
  }

  /**
   * Optimize routes and provide suggestions
   */
  async optimizeRoutes(routeData: any): Promise<AIAnalysisResponse> {
    try {
      const prompt = `
        Analyze the following route data for Areno Logistics and provide optimization suggestions:
        
        Route Data: ${JSON.stringify(routeData, null, 2)}
        
        Provide:
        1. Route efficiency analysis
        2. Time optimization suggestions
        3. Cost reduction opportunities
        4. Alternative route recommendations
        5. Fuel efficiency improvements
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a logistics route optimization expert with experience in transportation planning."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.3,
      });

      return {
        success: true,
        result: completion.choices[0].message.content || 'Unable to optimize routes',
        suggestions: this.extractSuggestions(completion.choices[0].message.content || '')
      };
    } catch (error) {
      console.error('AI Route Optimization Error:', error);
      return {
        success: false,
        error: 'Failed to optimize routes',
        result: ''
      };
    }
  }

  /**
   * Extract actionable suggestions from AI response
   */
  private extractSuggestions(response: string): string[] {
    const suggestions: string[] = [];
    const lines = response.split('\n');
    
    for (const line of lines) {
      if (line.includes('•') || line.includes('-') || line.includes('*')) {
        suggestions.push(line.trim());
      }
    }
    
    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }
}

export default AIService.getInstance(); 