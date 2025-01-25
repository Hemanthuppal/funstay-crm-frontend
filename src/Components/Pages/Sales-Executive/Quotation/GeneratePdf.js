import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import QuotationPDF from './Quotationpdf';

const GeneratePDF = () => {
  const data = {
    quotationNumber: 'Quotation01',
    quotationDate: '2024-06-22',
    dueDate: '2024-06-23',
    items: [
      {
        description: 'Homestay',
        members: '10',
        rate: '30000',
        rooms: '2',
        gst: '300',
        total: '30150'
      },
      {
        description: 'Homestay',
        members: '18',
        rate: '50000',
        rooms: '2',
        gst: '9000',
        total: '54500'
      }
    ],
    amountInWords: 'Ninety three thousand and nine hundred and fifty',
    bankName: 'IDFC BANK LIMITED',
    accountName: 'KRIKA MKB CORPORATION PRIVATE LIMITED',
    accountNo: '10006839067',
    ifscCode: 'IDF0080177',
    nonTaxableAmount: '70702.97025703',
    taxableAmount: '80000',
    gstTotal: '9300',
    adjustment: '0',
    quotationTotal: 'INR 93950'
  };

  return (
    <div className="p-4">
      <PDFDownloadLink
        document={<QuotationPDF data={data} />}
        fileName="Quotation.pdf"
       
      >
        {({ loading }) => (loading ? 'Loading document...' : 'Download Quotation PDF')}button
      </PDFDownloadLink>
    </div>
  );
};

export default GeneratePDF;