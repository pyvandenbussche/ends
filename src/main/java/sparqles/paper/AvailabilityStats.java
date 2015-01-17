package sparqles.paper;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import sparqles.paper.objects.AvailEp;
import sparqles.paper.objects.AvailJson;
import arq.cmdline.CmdGeneral;

import com.google.gson.Gson;

public class AvailabilityStats extends CmdGeneral  {
	private String atasksPath=null;
	private File outputFolderFile=null;

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		new AvailabilityStats(args).mainRun();
	}
	
	public AvailabilityStats(String[] args) {
		super(args);
		getUsage().startCategory("Arguments");
		getUsage().addUsage("atasks", "absolute path for the availability atasks.json file  (e.g. /home/...)");
		getUsage().addUsage("outputFolderPath", "absolute path for the output folder where stats will be generated  (e.g. /home/...)");
	}
	
	@Override
    protected String getCommandName() {
		return "availabilityStats";
	}
	
	@Override
	protected String getSummary() {
		return getCommandName() + " atasks (e.g. /home/...)";
	}

	@Override
	protected void processModulesAndArgs() {
		if (getPositional().size() < 2) {
			doHelp();
		}
		atasksPath = getPositionalArg(0);
		try {
			outputFolderFile = new File(getPositionalArg(1));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	protected void exec() {
		try {
			Gson gson = new Gson();
			List<AvailEp> eps = new ArrayList<AvailEp>();
			BufferedReader br = Files.newBufferedReader(Paths.get(atasksPath), StandardCharsets.UTF_8); 
			int cpt=0;
		    for (String line = null; (line = br.readLine()) != null;) {
		    	
//		       System.out.println(line);
		       AvailJson obj = gson.fromJson(line, AvailJson.class);
		       SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		       if(obj.getStartDate()!=null && obj.getSPARQLURI()!=null){
//		    	   System.out.println(obj.getSPARQLURI()+"\t"+obj.isAvailable()+"\t"+sdf.format(obj.getStartDate()));
		    	   AvailEp ep = new AvailEp(obj.getSPARQLURI());
		    	   int indexEp = eps.indexOf(ep);
		    	   if(indexEp>-1){//means it already exists
		    		   eps.get(indexEp).addResult(obj.getStartDate(), obj.isAvailable());
		    	   }
		    	   else{
		    		   ep.addResult(obj.getStartDate(), obj.isAvailable());
		    		   eps.add(ep);
		    	   }
		       }
//		       if(cpt>1000000)break;
		       cpt++;
		    }
		    StringBuilder sbListEPsAlive = new StringBuilder();
		    for (AvailEp availEp : eps) {
		    	availEp.prettyPrint();
		    	if(availEp.isAlive(4))sbListEPsAlive.append(availEp.getEpURI()+System.getProperty("line.separator"));
			}
		    writeListEPsAlive(sbListEPsAlive.toString());
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
	
	private void writeListEPsAlive(String content){
		if(!outputFolderFile.exists())outputFolderFile.mkdir();
		FileOutputStream fop = null;
		File file;
	
		try {
	
			file = new File(outputFolderFile.getAbsolutePath()+"/"+"epsAlive.csv");
			if(file.exists())file.delete();
			file.createNewFile();
			
			fop = new FileOutputStream(file);
		
			// get the content in bytes
			byte[] contentInBytes = content.getBytes();
	
			fop.write(contentInBytes);
			fop.flush();
			fop.close();
	
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				if (fop != null) {
					fop.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}
