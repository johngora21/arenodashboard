interface EmailData {
  to: string
  from: string
  subject: string
  message: string
  senderName: string
  recipientName: string
  groupName?: string
}

interface EmailResponse {
  success: boolean
  message_id?: string
  error?: string
}

export class EmailService {
  private emailjsUserId = "YOUR_EMAILJS_USER_ID" // Replace with your EmailJS user ID
  private emailjsServiceId = "YOUR_EMAILJS_SERVICE_ID" // Replace with your EmailJS service ID
  private emailjsTemplateId = "YOUR_EMAILJS_TEMPLATE_ID" // Replace with your EmailJS template ID

  public async sendChatEmail(emailData: EmailData): Promise<EmailResponse> {
    try {
      // For now, we'll use a simple approach with EmailJS
      // You can replace this with your preferred email service
      
      const templateParams = {
        to_email: emailData.to,
        to_name: emailData.recipientName,
        from_name: emailData.senderName,
        message: emailData.message,
        subject: emailData.subject,
        group_name: emailData.groupName || 'Chat Group'
      }

      // If you have EmailJS set up, uncomment this:
      /*
      const response = await fetch(`https://api.emailjs.com/api/v1.0/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: this.emailjsServiceId,
          template_id: this.emailjsTemplateId,
          user_id: this.emailjsUserId,
          template_params: templateParams
        })
      })

      if (!response.ok) {
        throw new Error(`Email API error: ${response.status}`)
      }

      const result = await response.json()
      */

      // For now, we'll simulate sending an email
      console.log('Sending email with data:', templateParams)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return {
        success: true,
        message_id: `email_${Date.now()}`
      }
    } catch (error) {
      console.error("Email sending error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }
    }
  }

  public async sendDirectMessageEmail(
    senderName: string,
    senderEmail: string,
    recipientEmail: string,
    recipientName: string,
    message: string
  ): Promise<EmailResponse> {
    const emailData: EmailData = {
      to: recipientEmail,
      from: senderEmail,
      subject: `New message from ${senderName}`,
      message: message,
      senderName: senderName,
      recipientName: recipientName
    }

    return this.sendChatEmail(emailData)
  }

  public async sendGroupMessageEmail(
    senderName: string,
    senderEmail: string,
    recipientEmail: string,
    recipientName: string,
    message: string,
    groupName: string
  ): Promise<EmailResponse> {
    const emailData: EmailData = {
      to: recipientEmail,
      from: senderEmail,
      subject: `New message in ${groupName}`,
      message: message,
      senderName: senderName,
      recipientName: recipientName,
      groupName: groupName
    }

    return this.sendChatEmail(emailData)
  }

  // New utility functions for different pages
  public async sendCustomerMessageEmail(
    senderName: string,
    senderEmail: string,
    customerEmail: string,
    customerName: string,
    message: string,
    context: string = 'CRM'
  ): Promise<EmailResponse> {
    const emailData: EmailData = {
      to: customerEmail,
      from: senderEmail,
      subject: `Message from Areno Logistics - ${context}`,
      message: message,
      senderName: senderName,
      recipientName: customerName
    }

    return this.sendChatEmail(emailData)
  }

  public async sendQuoteMessageEmail(
    senderName: string,
    senderEmail: string,
    customerEmail: string,
    customerName: string,
    message: string,
    quoteId: string
  ): Promise<EmailResponse> {
    const emailData: EmailData = {
      to: customerEmail,
      from: senderEmail,
      subject: `Quote Update - Areno Logistics`,
      message: message,
      senderName: senderName,
      recipientName: customerName
    }

    return this.sendChatEmail(emailData)
  }

  public async sendTeamMessageEmail(
    senderName: string,
    senderEmail: string,
    memberEmail: string,
    memberName: string,
    message: string,
    teamContext: string = 'Team'
  ): Promise<EmailResponse> {
    const emailData: EmailData = {
      to: memberEmail,
      from: senderEmail,
      subject: `Team Message - ${teamContext}`,
      message: message,
      senderName: senderName,
      recipientName: memberName
    }

    return this.sendChatEmail(emailData)
  }

  public async sendNotificationEmail(
    senderName: string,
    senderEmail: string,
    recipientEmail: string,
    recipientName: string,
    subject: string,
    message: string
  ): Promise<EmailResponse> {
    const emailData: EmailData = {
      to: recipientEmail,
      from: senderEmail,
      subject: subject,
      message: message,
      senderName: senderName,
      recipientName: recipientName
    }

    return this.sendChatEmail(emailData)
  }

  // Email templates
  public getDirectMessageSubject(senderName: string): string {
    return `New message from ${senderName} - Areno Logistics`
  }

  public getGroupMessageSubject(groupName: string, senderName: string): string {
    return `New message in ${groupName} from ${senderName} - Areno Logistics`
  }

  public formatEmailMessage(message: string, senderName: string, isGroup: boolean = false, groupName?: string): string {
    const header = isGroup 
      ? `You have a new message in the group "${groupName}" from ${senderName}:`
      : `You have a new message from ${senderName}:`
    
    return `${header}\n\n"${message}"\n\nThis message was sent via the Areno Logistics chat system.`
  }

  // Template messages for different contexts
  public getCustomerServiceTemplate(customerName: string, context: string): string {
    return `Dear ${customerName},\n\nThank you for contacting Areno Logistics. We have received your inquiry and our team will get back to you shortly.\n\nBest regards,\nAreno Logistics Team`
  }

  public getQuoteUpdateTemplate(customerName: string, quoteId: string): string {
    return `Dear ${customerName},\n\nWe have an update regarding your quote (${quoteId}). Please check your dashboard for the latest information.\n\nBest regards,\nAreno Logistics Team`
  }

  public getTeamNotificationTemplate(memberName: string, teamContext: string): string {
    return `Dear ${memberName},\n\nYou have a new team message in ${teamContext}. Please check your dashboard for details.\n\nBest regards,\nAreno Logistics Team`
  }
}

export const emailService = new EmailService() 